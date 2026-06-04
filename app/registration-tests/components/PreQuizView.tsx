
import React from 'react';
import { TeamInfo } from '../types';
import Icon from './Icon';

interface PreQuizViewProps {
  teamInfo: TeamInfo;
  setTeamInfo: (info: TeamInfo) => void;
  onStart: () => void;
  instructions?: string;
}

const PreQuizView: React.FC<PreQuizViewProps> = ({ teamInfo, setTeamInfo, onStart, instructions }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamInfo({ ...teamInfo, [name]: value });
  };

  const canStart = teamInfo.name.trim() !== '' && teamInfo.email.trim() !== '' && teamInfo.vehicleCategory;
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-red-900 text-center">
          ⚠️ Please refresh the page at 13:00 CET to access the quiz
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Quiz Registration</h2>
            <p className="mt-2 text-gray-500">Please enter your team details below to begin the quiz.</p>
            {instructions && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <p className="text-sm font-semibold text-blue-900 mb-2">Instructions:</p>
                <p className="text-sm text-blue-800 whitespace-pre-line">{instructions}</p>
              </div>
            )}
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={teamInfo.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Aristotle University Racing Team"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Team Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={teamInfo.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., contact@your-team.com"
              required
            />
          </div>
          <div>
            <label htmlFor="vehicleCategory" className="block text-sm font-medium text-gray-700">Vehicle Category *</label>
            <select
              name="vehicleCategory"
              id="vehicleCategory"
              value={teamInfo.vehicleCategory || ''}
              onChange={(e) => setTeamInfo({ ...teamInfo, vehicleCategory: e.target.value as 'EV' | 'CV' })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select vehicle category</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="CV">Combustion Vehicle (CV)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the category of vehicle your team will compete with</p>
          </div>
        </form>

        <div className="flex items-start bg-yellow-50 p-5 rounded-lg border border-yellow-200">
            <Icon name="warning" className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3 flex-1">
                <p className="text-sm text-yellow-800 font-semibold mb-3">Important Information:</p>
                <div className="space-y-3 text-sm text-yellow-700">
                    <div>
                        <p className="font-semibold text-yellow-800 mb-1.5">RULES:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Read all questions carefully</li>
                            <li>One attempt only</li>
                            <li>Progress saves automatically</li>
                            <li>Quiz ends after you submit your answers AND select your preferred vehicle number</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-yellow-800 mb-1.5">SCORING:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Correct Answer = full points</li>
                            <li>Incorrect Answer = half of the question&apos;s points deducted</li>
                            <li>Blank Answer / &quot;Not Answer&quot; = no impact on your score</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-yellow-800 mb-1.5">OPEN-ENDED:</p>
                        <p className="ml-2">If you don&apos;t wish to answer, enter a space or &quot;-&quot;.</p>
                    </div>
                    <div className="pt-2 border-t border-yellow-300 mt-3">
                        <ul className="list-disc list-inside space-y-1.5">
                            <li>Do not refresh the page once the quiz begins.</li>
                            <li>Ensure you have a stable internet connection.</li>
                            <li>Your submission time is recorded on the server.</li>
                            <li>
                                Keep the competition documents handy — the Formula Hellas Handbook
                                and the Rules &amp; Clarifications are available on the{' '}
                                <a
                                    href="/rules"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-yellow-900 font-medium"
                                >
                                    Rules &amp; Documents
                                </a>{' '}
                                page.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`w-full max-w-xs flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-105 ${
              canStart
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Icon name="submit" className="h-5 w-5 mr-2" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreQuizView;
