
import React from 'react';
import Icon from './Icon';

interface CountdownTimerProps {
  timeRemaining: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const timeColor = timeRemaining <= 60 ? 'text-red-500' : 'text-gray-700';

  return (
    <div className={`flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg font-semibold ${timeColor}`}>
      <Icon name="clock" className="h-5 w-5" />
      <span className="tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <span className="hidden sm:inline">Remaining</span>
    </div>
  );
};

export default CountdownTimer;
