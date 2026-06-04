'use client';

import { useState } from 'react';
import { Lock, ArrowLeft, BarChart3, Users, CheckCircle2, Clock, FileText, X, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface QuizSubmission {
  id: string;
  team_name: string;
  team_email: string;
  time_taken: number;
  score: number;
  questions: any[];
  answers: Record<number, string>;
  submitted_at: string;
}

export default function TeamAccessPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [quizConfig, setQuizConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);

  const handlePinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    // Trim and validate PIN
    const trimmedPin = pin.trim();
    
    if (!trimmedPin) {
      setError('Please enter a PIN');
      return;
    }
    
    if (trimmedPin === '1926') {
      setIsAuthenticated(true);
      setPin('');
      setAttempts(0);
      fetchSubmissions();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      
      if (newAttempts >= 3) {
        setError('Too many incorrect attempts. Please try again later.');
      } else {
        setError('Incorrect PIN. Please try again.');
      }
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch submissions
      const submissionsRes = await fetch('/api/quiz/submissions');
      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        setSubmissions(data.submissions || []);
      } else {
        const errorData = await submissionsRes.json().catch(() => ({}));
        console.error('Failed to fetch submissions:', submissionsRes.status, errorData);
        // Set empty array on error so UI doesn't break
        setSubmissions([]);
      }

      // First try to fetch active quiz config
      const configRes = await fetch('/api/quiz/config');
      if (configRes.ok) {
        const config = await configRes.json();
        if (config.error) {
          console.error('Quiz config error:', config.error);
          // Try to fetch latest quiz (even if not active) for correct answers
          await fetchLatestQuiz();
        } else {
          setQuizConfig(config);
        }
      } else if (configRes.status === 404) {
        // No active quiz - try to fetch latest quiz for correct answers
        await fetchLatestQuiz();
      } else {
        console.error('Failed to fetch quiz config:', configRes.status);
        setQuizConfig({ questions: [], title: 'Error Loading Quiz' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuizConfig({ questions: [], title: 'Error Loading Quiz' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestQuiz = async () => {
    try {
      const latestRes = await fetch('/api/quiz/latest');
      if (latestRes.ok) {
        const latestQuiz = await latestRes.json();
        setQuizConfig(latestQuiz);
      } else {
        console.warn('No quiz found (active or inactive)');
        setQuizConfig({ questions: [], title: 'No Quiz Found' });
      }
    } catch (error) {
      console.error('Error fetching latest quiz:', error);
      setQuizConfig({ questions: [], title: 'No Quiz Found' });
    }
  };

  const calculateStats = () => {
    if (submissions.length === 0) return null;

    const totalTeams = submissions.length;
    // Get total questions from quiz config, or from the first submission's questions array
    const totalQuestions = quizConfig?.questions?.length || 
                          (submissions[0]?.questions?.length || 0);
    const avgScore = submissions.reduce((sum, s) => sum + s.score, 0) / totalTeams;
    const avgTime = submissions.reduce((sum, s) => sum + s.time_taken, 0) / totalTeams;
    const perfectScores = submissions.filter(s => s.score === totalQuestions).length;

    return { totalTeams, avgScore, avgTime, perfectScores, totalQuestions };
  };

  if (isAuthenticated) {
    const stats = calculateStats();
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link 
              href="/team-portal" 
              className="text-primary-blue hover:text-primary-blue-dark inline-flex items-center gap-2 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team Portal
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Submissions</h1>
            <div className="w-24"></div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
          ) : (
            <>
              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-primary-blue" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Teams</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.avgScore.toFixed(1)}/{stats.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg Time</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.floor(stats.avgTime / 60)}m {Math.floor(stats.avgTime % 60)}s
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Perfect Scores</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.perfectScores}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submissions Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">All Team Submissions</h2>
                  <p className="text-sm text-gray-500 mt-1">Read-only view of all quiz submissions</p>
                </div>
                {submissions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {submission.team_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {submission.team_email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {(() => {
                                const totalQuestions = quizConfig?.questions?.length || 
                                                      submission.questions?.length || 0;
                                return (
                                  <span className={`font-semibold ${
                                    submission.score === totalQuestions
                                      ? 'text-green-600'
                                      : submission.score >= totalQuestions * 0.7
                                      ? 'text-blue-600'
                                      : 'text-red-600'
                                  }`}>
                                    {submission.score}/{totalQuestions}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.floor(submission.time_taken / 60)}m {submission.time_taken % 60}s
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(submission.submitted_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowAnswersModal(true);
                                }}
                                className="text-primary-blue hover:text-primary-blue-dark font-medium"
                                disabled={!submission.questions || submission.questions.length === 0}
                              >
                                View Answers
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Answers Modal */}
          {showAnswersModal && selectedSubmission && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                  onClick={() => setShowAnswersModal(false)}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Quiz Submission Details
                  </h3>
                  <button
                    onClick={() => setShowAnswersModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Team Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Team Name</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedSubmission.team_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedSubmission.team_email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedSubmission.score}/{(() => {
                          const questions = (quizConfig?.questions && quizConfig.questions.length > 0) 
                            ? quizConfig.questions 
                            : (selectedSubmission.questions || []);
                          return questions.length;
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time Taken</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {Math.floor(selectedSubmission.time_taken / 60)}m {selectedSubmission.time_taken % 60}s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(() => {
                    const questions = (quizConfig?.questions && quizConfig.questions.length > 0) 
                      ? quizConfig.questions 
                      : (selectedSubmission.questions || []);
                    const answers = selectedSubmission.answers || {};

                    if (questions.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          No question data available.
                        </div>
                      );
                    }

                    // Merge correct answers from quiz config if available
                    const questionsWithCorrectAnswers = questions.map((q: any, idx: number) => {
                      const configQuestion = quizConfig?.questions?.find((cq: any) => 
                        cq.id === q.id || 
                        cq.id === (idx + 1) ||
                        cq.text === q.text
                      );
                      return {
                        ...q,
                        correctOption: q.correctOption || configQuestion?.correctOption || 'N/A'
                      };
                    });

                    return questionsWithCorrectAnswers.map((q: any, idx: number) => {
                      const questionId = q.id || (idx + 1);
                      const answer = answers[questionId] || 
                                    answers[questionId as number] || 
                                    answers[idx + 1] || 
                                    (answers as any)[String(questionId)] || 
                                    (answers as any)[String(idx + 1)] || 
                                    'NO_ANSWER';
                      const correctOption = q.correctOption || 'N/A';
                      const isCorrect = answer === correctOption && answer !== 'NO_ANSWER';

                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Question {idx + 1}
                            </h4>
                            {isCorrect ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <XCircle className="h-4 w-4 mr-1" />
                                Incorrect
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-4">{q.text || 'Question text not available'}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm font-medium text-green-700 mb-1">Correct Answer</p>
                              <p className="text-base font-semibold text-green-900">{correctOption}</p>
                            </div>
                            <div className={`p-3 rounded-lg border ${
                              isCorrect 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <p className="text-sm font-medium mb-1" style={{ color: isCorrect ? '#15803d' : '#dc2626' }}>
                                Team Answer
                              </p>
                              <p className={`text-base font-semibold ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                                {answer === 'NO_ANSWER' ? 'No answer provided' : answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowAnswersModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-blue text-base font-medium text-white hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          href="/team-portal" 
          className="text-primary-blue hover:text-primary-blue-dark mb-6 inline-flex items-center gap-2 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Portal
        </Link>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Formula Hellas Team Access
            </h1>
            <p className="text-lg text-gray-600">
              Enter your PIN to access Formula Hellas team resources
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-bold text-gray-900 mb-2">
                Enter PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-racing-red">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-primary text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 px-8 py-4 text-lg"
            >
              <Lock className="w-5 h-5" />
              Unlock Access
            </button>
          </form>

          {attempts > 0 && attempts < 3 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Attempts remaining: {3 - attempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

