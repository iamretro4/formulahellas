
import React from 'react';
import { TeamInfo } from '../types';
import Icon from './Icon';

interface ResultsViewProps {
  timeTaken: number | null;
  teamInfo: TeamInfo;
  isAdmin?: boolean;
  score?: number | null;
  totalQuestions?: number;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  timeTaken, 
  teamInfo, 
  isAdmin = false,
  score = null,
  totalQuestions = 0
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md text-center space-y-6">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <Icon name="check" className="h-10 w-10 text-green-600"/>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Submission Confirmed!</h2>
                <p className="text-gray-600">
                    Thank you, <span className="font-semibold">{teamInfo.name}</span>. Your quiz results have been successfully recorded.
                </p>

                {timeTaken !== null && (
                    <div className="bg-gray-50 border rounded-lg p-6 w-full">
                        <p className="text-sm font-medium text-gray-500">Time Taken</p>
                        <div className="flex items-baseline justify-center mt-2">
                            <p className="text-6xl font-extrabold text-blue-600">{formatTime(timeTaken)}</p>
                        </div>
                        <p className="text-lg font-medium text-gray-700 mt-1">minutes:seconds</p>
                    </div>
                )}

                {isAdmin && score !== null && totalQuestions > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full">
                        <p className="text-sm font-medium text-blue-800 mb-2">Admin View - Score</p>
                        <div className="flex items-baseline justify-center mt-2">
                            <p className="text-4xl font-extrabold text-blue-600">{score}</p>
                            <p className="text-xl font-semibold text-blue-400 ml-1">/ {totalQuestions}</p>
                        </div>
                        <p className="text-md font-medium text-blue-700 mt-1">
                            ({Math.round((score / totalQuestions) * 100)}%)
                        </p>
                    </div>
                )}

                <div className="text-sm text-gray-500 pt-4 border-t">
                    <p>The correct answers and official rankings will be released after the quiz period has ended for all teams.</p>
                    <p className="mt-2">You may now close this window.</p>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;
