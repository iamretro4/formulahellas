'use client';

import { usePathname } from 'next/navigation';
import NavigationClient from "@/components/NavigationClient";
import FooterClient from "@/components/FooterClient";
import { useEffect, useState } from 'react';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    // Dynamic polling: 5 minutes when inactive, 30 seconds when active
    let cachedData: any = null;
    let lastFetch = 0;
    let intervalId: NodeJS.Timeout | null = null;
    const CACHE_DURATION_INACTIVE = 5 * 60 * 1000; // 5 minutes cache when inactive
    const CACHE_DURATION_ACTIVE = 30000; // 30 seconds cache when active
    const POLL_INTERVAL_INACTIVE = 5 * 60 * 1000; // 5 minutes when inactive
    const POLL_INTERVAL_ACTIVE = 30000; // 30 seconds when active
    
    const checkQuiz = async () => {
      try {
        const now = Date.now();
        const currentTime = Date.now();
        
        // Determine if quiz should be active based on cached data
        let quizShouldBeActive = false;
        if (cachedData) {
          const start = new Date(cachedData.scheduledStartTime);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours
          quizShouldBeActive = currentTime >= start.getTime() && currentTime <= end.getTime();
        }
        
        // Use cached data if available and fresh (different cache duration based on quiz state)
        const cacheDuration = quizShouldBeActive ? CACHE_DURATION_ACTIVE : CACHE_DURATION_INACTIVE;
        if (cachedData && (now - lastFetch) < cacheDuration) {
          setIsQuizActive(quizShouldBeActive);
          return;
        }
        
        // Fetch fresh data
        const res = await fetch('/api/quiz/config', {
          next: { revalidate: 30 }
        });
        if (res.ok) {
          const data = await res.json();
          cachedData = data;
          lastFetch = now;
          const start = new Date(data.scheduledStartTime);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours fixed
          const isActive = currentTime >= start.getTime() && currentTime <= end.getTime();
          setIsQuizActive(isActive);
          
          // Adjust polling interval based on quiz state
          if (intervalId) {
            clearInterval(intervalId);
          }
          
          const pollInterval = isActive ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_INACTIVE;
          intervalId = setInterval(checkQuiz, pollInterval);
        } else if (res.status === 404) {
          // No active quiz - use inactive polling
          setIsQuizActive(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
          intervalId = setInterval(checkQuiz, POLL_INTERVAL_INACTIVE);
        }
      } catch (error) {
        console.error('Error checking quiz status:', error);
        // On error, use inactive polling
        if (intervalId) {
          clearInterval(intervalId);
        }
        intervalId = setInterval(checkQuiz, POLL_INTERVAL_INACTIVE);
      }
    };
    
    // Initial check
    checkQuiz();
    
    // Start with inactive polling (will adjust after first check)
    intervalId = setInterval(checkQuiz, POLL_INTERVAL_INACTIVE);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Hide header/footer ONLY for quiz pages or when quiz is active on home page
  // Default behavior: show navigation and footer
  const isQuizPage = pathname ? pathname.includes('/registration-tests') : false;
  const shouldHideNav = isQuizPage || (isQuizActive && pathname === '/');

  // Only hide navigation/footer for specific quiz-related conditions
  if (shouldHideNav) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Always show navigation and footer for non-quiz pages
  return (
    <>
      <NavigationClient />
      <main className="min-h-screen">{children}</main>
      <FooterClient />
    </>
  );
}

