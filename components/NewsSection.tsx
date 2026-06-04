'use client';

import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import Card from './ui/Card';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

interface NewsItem {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  featuredImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

interface NewsSectionProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={clsx('mb-12 scroll-animate', inView && 'visible')}>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
          <p className="text-gray-600">Stay updated with the latest announcements and updates</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <NewsCard
              key={item._id}
              item={item}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsCard({
  item,
  index,
  inView,
}: {
  item: NewsItem;
  index: number;
  inView: boolean;
}) {
  return (
    <Link
      href={`/posts/${item.slug.current}`}
      className={clsx(
        'group block scroll-animate',
        inView && 'visible'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Card className="h-full flex flex-col overflow-hidden p-0">
        {item.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <Image
              src={urlFor(item.featuredImage).width(600).height(400).url()}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-3">
            <Calendar className="w-4 h-4 text-primary-blue" />
            <span>
              {new Date(item.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
              {item.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center text-primary-blue text-sm font-semibold group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

