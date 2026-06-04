'use client';

import { useEffect, useState } from 'react';

export default function StudioDebugPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/studio-debug')
      .then((res) => res.json())
      .then((data) => {
        setEnvData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking environment variables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-2xl w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sanity Studio Environment Check</h1>

        {envData && (
          <div className="space-y-6">
            {/* Status */}
            <div
              className={`p-6 rounded-lg border-2 ${
                envData.status === 'ok'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {envData.status === 'ok' ? '✅ Status: OK' : '⚠️ Status: Issues Found'}
              </h2>
              <p className="text-gray-700">{envData.message}</p>
            </div>

            {/* Issues */}
            {envData.issues && envData.issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Issues Found:</h3>
                <ul className="space-y-2">
                  {envData.issues.map((issue: string, idx: number) => (
                    <li key={idx} className="text-red-700">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Environment Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Environment Variables:</h3>
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-gray-600">NEXT_PUBLIC_SANITY_PROJECT_ID:</span>{' '}
                  <span
                    className={
                      envData.environment.server.hasProjectId
                        ? 'text-green-600 font-bold'
                        : 'text-red-600'
                    }
                  >
                    {envData.environment.server.projectId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">NEXT_PUBLIC_SANITY_DATASET:</span>{' '}
                  <span
                    className={
                      envData.environment.server.hasDataset
                        ? 'text-green-600 font-bold'
                        : 'text-yellow-600'
                    }
                  >
                    {envData.environment.server.dataset}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">STUDIO_PASSWORD:</span>{' '}
                  <span
                    className={
                      envData.environment.server.hasStudioPassword
                        ? 'text-green-600 font-bold'
                        : 'text-red-600'
                    }
                  >
                    {envData.environment.server.hasStudioPassword ? 'SET' : 'NOT SET'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">SANITY_API_TOKEN:</span>{' '}
                  <span
                    className={
                      envData.environment.server.hasApiToken
                        ? 'text-green-600 font-bold'
                        : 'text-yellow-600'
                    }
                  >
                    {envData.environment.server.hasApiToken ? 'SET' : 'NOT SET (optional)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600">NODE_ENV:</span>{' '}
                  <span className="text-gray-800">{envData.environment.server.nodeEnv}</span>
                </div>
                <div>
                  <span className="text-gray-600">VERCEL:</span>{' '}
                  <span className="text-gray-800">
                    {envData.environment.server.vercel ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">VERCEL_ENV:</span>{' '}
                  <span className="text-gray-800">{envData.environment.server.vercelEnv}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {envData.instructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">How to Fix:</h3>
                <ol className="space-y-3 text-blue-700">
                  <li>
                    <strong>Step 1:</strong> {envData.instructions.step1}
                  </li>
                  <li>
                    <strong>Step 2:</strong> {envData.instructions.step2}
                    <ul className="mt-2 ml-4 space-y-1">
                      {envData.instructions.required.map((req: string, idx: number) => (
                        <li key={idx} className="font-mono text-sm">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <strong>Step 3:</strong> {envData.instructions.step3}
                  </li>
                  <li>
                    <strong>Step 4:</strong>{' '}
                    <span className="font-semibold text-red-600">
                      {envData.instructions.step4}
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

