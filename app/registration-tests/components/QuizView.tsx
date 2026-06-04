
import React from 'react';
import { Question, Answers, TeamInfo } from '../types';
import Icon from './Icon';

interface QuizViewProps {
  questions: Question[];
  answers: Answers;
  setAnswers: (answers: Answers) => void;
  onSubmit: () => void;
  teamInfo: TeamInfo;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, answers, setAnswers, onSubmit, teamInfo }) => {
  const handleAnswerSelect = (questionId: number, option: string) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleTextAnswerChange = (questionId: number, text: string) => {
    setAnswers({
      ...answers,
      [questionId]: text || 'NO_ANSWER',
    });
  };
  
  // Filter questions based on vehicle category
  const filteredQuestions = React.useMemo(() => {
    if (!teamInfo.vehicleCategory) return questions;
    return questions.filter(q => 
      !q.category || q.category === 'common' || q.category === teamInfo.vehicleCategory
    );
  }, [questions, teamInfo.vehicleCategory]);
  
  // Allow submission even if some questions have "NO_ANSWER" or empty text
  // For open text questions, empty string is considered answered (they can leave it blank)
  const allQuestionsAnswered = filteredQuestions.every(q => {
    const answer = answers[q.id];
    return answer !== undefined && answer !== null;
  });

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quiz in Progress</h2>
                    <p className="mt-1 text-gray-500">Select the best answer for each question below.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 text-left sm:text-right bg-gray-50 p-3 rounded-lg border">
                    <p className="text-sm font-medium text-gray-500">Team</p>
                    <p className="font-semibold text-gray-800">{teamInfo.name || 'N/A'}</p>
                </div>
            </div>
        </div>
      
      <div className="space-y-6">
        {filteredQuestions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              <span className="text-blue-600 font-bold mr-2">Q{index + 1}.</span>
              {q.text}
            </p>
            {q.image && (
              <div className="mb-4">
                <img 
                  src={q.image} 
                  alt={`Question ${index + 1} illustration`}
                  className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
            {q.file && (
              <div className="mb-4">
                <a
                  href={`/api/download?url=${encodeURIComponent(q.file.url)}&filename=${encodeURIComponent(q.file.filename)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download {q.file.filename}
                  {q.file.size && (
                    <span className="ml-2 text-sm opacity-90">
                      ({(q.file.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </a>
              </div>
            )}
            {q.type === 'open_text' ? (
              <div className="space-y-3">
                <textarea
                  value={answers[q.id] && answers[q.id] !== 'NO_ANSWER' ? answers[q.id] : ''}
                  onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[100px] text-gray-700"
                  rows={4}
                />
                {answers[q.id] === 'NO_ANSWER' || !answers[q.id] ? (
                  <p className="text-sm text-gray-500 italic">If you don&apos;t wish to answer, enter a space or &quot;-&quot; .</p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {(q.options || []).map(option => {
                  const isSelected = answers[q.id] === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(q.id, option)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-md text-gray-700">{option}</span>
                    </label>
                  );
                })}
                <label
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150 ${
                    answers[q.id] === 'NO_ANSWER'
                      ? 'bg-gray-50 border-gray-500 ring-2 ring-gray-300'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="NO_ANSWER"
                    checked={answers[q.id] === 'NO_ANSWER'}
                    onChange={() => handleAnswerSelect(q.id, 'NO_ANSWER')}
                    className="h-4 w-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="ml-3 text-md text-gray-700 italic">No answer</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center sticky bottom-4">
        <button
          onClick={onSubmit}
          disabled={!allQuestionsAnswered}
          className={`w-full max-w-xs flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-105 ${
            allQuestionsAnswered
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Icon name="submit" className="h-5 w-5 mr-2" />
          {allQuestionsAnswered ? 'Submit Final Answers' : 'Answer All Questions'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
