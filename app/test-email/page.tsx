'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [teamEmail, setTeamEmail] = useState('');
  const [teamName, setTeamName] = useState('Test Team');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamEmail,
          teamName,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setResult(data);
      } else {
        // Response is not JSON (likely HTML error page)
        const textResponse = await response.text();
        setResult({
          success: false,
          error: 'Invalid response from server',
          message: `Server returned non-JSON response (status ${response.status}). The API endpoint may have an error.`,
          details: textResponse.substring(0, 500),
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Quiz Email</h1>
          <p className="text-gray-600 mb-8">
            Use this page to test the quiz submission email function. Enter your email address to receive a test email.
          </p>

          <form onSubmit={handleTest} className="space-y-6">
            <div>
              <label htmlFor="teamEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address *
              </label>
              <input
                type="email"
                id="teamEmail"
                required
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Test Team"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !teamEmail}
              className="w-full px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-blue-dark transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Sending Test Email...' : 'Send Test Email'}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-lg border-2 ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-2 ${
                result.success ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {result.success ? '✅ Test Result' : '⚠️ Test Result'}
              </h2>
              <p className={`mb-4 ${result.success ? 'text-green-700' : 'text-yellow-700'}`}>
                {result.message}
              </p>
              {result.emailResult && (
                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Email Service Response:</h3>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(result.emailResult, null, 2)}
                  </pre>
                </div>
              )}
              {result.testData && (
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Test Data:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Team: {result.testData.teamName}</li>
                    <li>Email: {result.testData.teamEmail}</li>
                    <li>Time Taken: {Math.floor(result.testData.timeTaken / 60)}:{(result.testData.timeTaken % 60).toString().padStart(2, '0')}</li>
                    <li>Questions: {result.testData.questionsCount}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Make sure <code className="bg-blue-100 px-1 rounded">RESEND_API_KEY</code> is set in your environment variables</li>
              <li>In development mode, emails are logged to console if API key is not configured</li>
              <li>Email failures won&apos;t affect quiz submissions - they&apos;re sent asynchronously</li>
              <li>Check your spam folder if you don't see the email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

