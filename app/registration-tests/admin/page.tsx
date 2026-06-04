'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, BarChart3, Users, FileText, Settings, CheckCircle2, XCircle, Clock, X, Upload, Download, Network } from 'lucide-react';
import Button from '@/components/ui/Button';

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

export default function QuizAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [quizConfig, setQuizConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'config' | 'iplogs'>('results');
  const [ipLogs, setIpLogs] = useState<any>(null);
  const [loadingIpLogs, setLoadingIpLogs] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [redirectToGoogleForms, setRedirectToGoogleForms] = useState(false);
  const [togglingRedirect, setTogglingRedirect] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/studio-auth');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch submissions
      const submissionsRes = await fetch('/api/quiz/admin/submissions');
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
          setRedirectToGoogleForms(config.redirectToGoogleForms || false);
        }
      } else if (configRes.status === 404) {
        // No active quiz - try to fetch latest quiz for correct answers
        await fetchLatestQuiz();
      } else {
        console.error('Failed to fetch quiz config:', configRes.status);
        setQuizConfig({ questions: [], title: 'Error Loading Quiz' });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuizConfig({ questions: [], title: 'Error Loading Quiz' });
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

  const fetchIpLogs = async () => {
    setLoadingIpLogs(true);
    try {
      const response = await fetch('/api/quiz/ip-logs');
      if (response.ok) {
        const data = await response.json();
        setIpLogs(data);
      } else {
        console.error('Failed to fetch IP logs');
        setIpLogs(null);
      }
    } catch (error) {
      console.error('Error fetching IP logs:', error);
      setIpLogs(null);
    } finally {
      setLoadingIpLogs(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError('');
    setImportSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const quizId = quizConfig?.id || null;
      const url = `/api/quiz/import${quizId ? `?quizId=${quizId}` : ''}`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Import failed');
      }

      setImportSuccess(data.message || 'Successfully imported questions');
      await fetchData();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setImportError(error.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/quiz/export/csv');
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Formula Hellas Quiz Scores.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/quiz/export/pdf');
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportScoringCSV = async () => {
    try {
      const response = await fetch('/api/quiz/export/scoring');
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-scoring-template-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export scoring CSV. Please try again.');
    }
  };

  const handleToggleGoogleFormsRedirect = async () => {
    const newValue = !redirectToGoogleForms;
    setTogglingRedirect(true);
    
    try {
      const response = await fetch('/api/quiz/toggle-google-forms-redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle redirect');
      }

      const data = await response.json();
      setRedirectToGoogleForms(newValue);
      
      // Show success message
      if (newValue) {
        alert('Google Forms redirect enabled. The entire site will now redirect to the Google Forms quiz.');
      } else {
        alert('Google Forms redirect disabled. The site will use the built-in quiz system.');
      }
    } catch (error: any) {
      alert(`Failed to toggle redirect: ${error.message}`);
    } finally {
      setTogglingRedirect(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter admin password to access quiz management
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter password"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full">Access Admin</Button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Admin Dashboard</h1>
            <button
              onClick={() => router.push('/studio')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Go to Sanity Studio →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="inline h-5 w-5 mr-2" />
              Results & Statistics
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="inline h-5 w-5 mr-2" />
              Quiz Configuration
            </button>
            <button
              onClick={() => {
                setActiveTab('iplogs');
                if (!ipLogs && !loadingIpLogs) {
                  fetchIpLogs();
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'iplogs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Network className="inline h-5 w-5 mr-2" />
              IP Logs & Verification
            </button>
          </nav>
        </div>

        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
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

            {/* Export Buttons */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Results</h3>
                  <p className="text-sm text-gray-600">Download quiz results in CSV or PDF format</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={handleExportScoringCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4" />
                    Export Scoring Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Team Submissions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
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
                              // Use questions from submission if quiz config is not available or has no questions
                              const questions = (quizConfig?.questions && quizConfig.questions.length > 0) 
                                ? quizConfig.questions 
                                : (submission.questions || []);
                              const answers = submission.answers || {};
                              
                              // Debug logging
                              console.log('Submission data:', {
                                hasQuizConfig: !!quizConfig,
                                quizConfigQuestions: quizConfig?.questions?.length || 0,
                                submissionQuestions: submission.questions?.length || 0,
                                submissionQuestionsData: submission.questions,
                                answers: answers,
                                selectedQuestions: questions,
                                selectedQuestionsLength: questions.length
                              });
                              
                              if (!questions || questions.length === 0) {
                                alert(`No question data available.\n\nQuiz Config Questions: ${quizConfig?.questions?.length || 0}\nSubmission Questions: ${submission.questions?.length || 0}\nSelected Questions: ${questions?.length || 0}\n\nPlease check the console for more details.`);
                                return;
                              }
                              
                              console.log('Processing questions:', questions);
                              console.log('Processing answers:', answers);
                              
                              let details = `Team: ${submission.team_name}\nEmail: ${submission.team_email}\nScore: ${submission.score}/${questions.length}\nTime: ${Math.floor(submission.time_taken / 60)}m ${submission.time_taken % 60}s\n\n`;
                              details += 'Question Details:\n';
                              details += '='.repeat(50) + '\n';
                              
                              // Merge correct answers from quiz config if available
                              const questionsWithCorrectAnswers = questions.map((q: any, idx: number) => {
                                // Try to find matching question in quiz config by id or text
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

                              questionsWithCorrectAnswers.forEach((q: any, idx: number) => {
                                // Questions from submission have id field, questions from config also have id
                                const questionId = q.id || (idx + 1);
                                // Try multiple ways to get the answer (by id as number, string, or index)
                                const answer = answers[questionId] || 
                                              answers[questionId as number] || 
                                              answers[idx + 1] || 
                                              (answers as any)[String(questionId)] || 
                                              (answers as any)[String(idx + 1)] || 
                                              'NO_ANSWER';
                                const correctOption = q.correctOption || 'N/A';
                                const isCorrect = answer === correctOption && answer !== 'NO_ANSWER';
                                
                                console.log(`Question ${idx + 1}:`, {
                                  questionId,
                                  question: q,
                                  answer,
                                  correctOption,
                                  isCorrect,
                                  allAnswers: answers
                                });
                                
                                details += `\nQ${idx + 1}: ${q.text || 'Question text not available'}\n`;
                                details += `Correct Answer: ${correctOption}\n`;
                                details += `Team Answer: ${answer}\n`;
                                details += `Status: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}\n`;
                                details += '-'.repeat(50) + '\n';
                              });
                              
                              alert(details);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            disabled={!submission.questions || submission.questions.length === 0}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Import Questions Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Questions from CSV</h2>
              <p className="text-gray-600 mb-4">
                Upload a CSV file to import quiz questions. The CSV should have columns: text, option1, option2, option3, option4, correctOption
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    disabled={importing}
                    className="hidden"
                    id="csv-import"
                  />
                  <label htmlFor="csv-import">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                      <Upload className="h-4 w-4" />
                      {importing ? 'Importing...' : 'Choose CSV File'}
                    </span>
                  </label>
                </div>
                
                {importError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {importError}
                  </div>
                )}
                
                {importSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                    {importSuccess}
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">CSV Format:</p>
                    <a
                      href="/quiz-questions-template.csv"
                      download
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Download Template CSV
                    </a>
                  </div>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
{`text,option1,option2,option3,option4,correctOption
"What is Formula Student?","A racing competition","A university competition","A car show","A design contest","A university competition"
"What is the maximum engine capacity?","600cc","610cc","620cc","650cc","610cc"}`}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: The correctOption must exactly match one of the option values (option1, option2, etc.)
                  </p>
                </div>
              </div>
            </div>

            {/* Google Forms Redirect Toggle */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Google Forms Redirect</h2>
              <p className="text-gray-600 mb-4">
                When enabled, the entire site will redirect to the Google Forms quiz instead of the built-in quiz system.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleGoogleFormsRedirect}
                  disabled={togglingRedirect}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    redirectToGoogleForms ? 'bg-blue-600' : 'bg-gray-200'
                  } ${togglingRedirect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  role="switch"
                  aria-checked={redirectToGoogleForms}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      redirectToGoogleForms ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {redirectToGoogleForms ? 'Enabled' : 'Disabled'}
                </span>
                {togglingRedirect && (
                  <span className="text-sm text-gray-500">Updating...</span>
                )}
              </div>
              {redirectToGoogleForms && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  ⚠️ Google Forms redirect is enabled. All visitors will be redirected to: <a href="https://forms.gle/f4QXcT2t2Csm9ooGA" target="_blank" rel="noopener noreferrer" className="underline">https://forms.gle/f4QXcT2t2Csm9ooGA</a>
                </div>
              )}
            </div>

            {/* Sanity Studio Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Configuration</h2>
              <p className="text-gray-600 mb-4">
                To manage quiz questions, time limits, and schedule, please use Sanity Studio.
              </p>
              <Button onClick={() => router.push('/studio')}>
                Open Sanity Studio
              </Button>
            {quizConfig && (
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Quiz Title</p>
                  <p className="text-gray-900">{quizConfig.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Scheduled Start</p>
                  <p className="text-gray-900">
                    {new Date(quizConfig.scheduledStartTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-gray-900">{quizConfig.durationMinutes} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Questions</p>
                  <p className="text-gray-900">{quizConfig.questions?.length || 0}</p>
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {activeTab === 'iplogs' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">IP Address Logs</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review IP addresses for verification. IPs are logged for all quiz submissions.
                  </p>
                </div>
                <button
                  onClick={fetchIpLogs}
                  disabled={loadingIpLogs}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingIpLogs ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loadingIpLogs ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading IP logs...</p>
                </div>
              ) : ipLogs ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-600">Total Submissions</p>
                      <p className="text-2xl font-bold text-blue-900">{ipLogs.total || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-600">Unique IPs</p>
                      <p className="text-2xl font-bold text-green-900">{ipLogs.uniqueIPs || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-yellow-600">Suspicious IPs</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {ipLogs.ipStats?.filter((stat: any) => stat.count > 1).length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submissions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teams
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ipLogs.ipStats?.map((stat: any, index: number) => (
                          <tr key={index} className={stat.count > 1 ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{stat.ip}</div>
                              {stat.count > 1 && (
                                <div className="text-xs text-yellow-600 font-semibold">⚠️ Multiple submissions</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                stat.count > 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {stat.count}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 space-y-1">
                                {stat.teams.map((team: any, teamIndex: number) => (
                                  <div key={teamIndex} className="flex items-center justify-between">
                                    <span className="font-medium">{team.teamName}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {new Date(team.submittedAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {stat.count > 1 && (
                                <span className="text-yellow-600 font-medium">Review needed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {ipLogs.ipStats?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No IP logs found.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Click "Refresh" to load IP logs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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
                                <CheckCircle2 className="h-4 w-4 mr-1" />
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

