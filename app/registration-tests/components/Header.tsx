
import React from 'react';
import { QuizStatus } from '../types';
import CountdownTimer from './CountdownTimer';
import Icon from './Icon';

interface HeaderProps {
    quizStatus: QuizStatus;
    timeRemaining: number;
}

const Header: React.FC<HeaderProps> = ({ quizStatus, timeRemaining }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-md">
              <Icon name="flag" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              Formula Hellas Registration Quiz
            </h1>
             <h1 className="text-lg font-bold text-gray-800 sm:hidden">
              Formula Hellas Quiz
            </h1>
          </div>

          {quizStatus === QuizStatus.ACTIVE && (
            <CountdownTimer timeRemaining={timeRemaining} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
