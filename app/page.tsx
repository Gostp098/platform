'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            Next.js Docker Demo
          </h1>
          <p className="text-xl text-gray-600">
            Successfully containerized and ready for deployment!
          </p>
        </div>

        {/* Demo Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <DemoCard
            title="Fast Performance"
            description="Next.js provides optimal performance with server-side rendering and automatic code splitting."
            icon="⚡"
          />
          <DemoCard
            title="Docker Ready"
            description="Containerized application for consistent deployment across any environment."
            icon="🐳"
          />
          <DemoCard
            title="DigitalOcean Deployed"
            description="Running smoothly on DigitalOcean droplets with automatic scaling."
            icon="☁️"
          />
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Interactive Counter</h2>
          <CounterDemo />
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">API Status</h2>
          <ApiStatus />
        </div>
      </div>
    </main>
  );
}

// Demo Card Component
function DemoCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Counter Component
function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-indigo-600 mb-4">{count}</p>
      <div className="space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Increase
        </button>
      </div>
    </div>
  );
}

// API Status Component
function ApiStatus() {
  const [status, setStatus] = useState('Checking...');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus('Online');
        setData(data);
      })
      .catch(() => setStatus('Offline'));
  }, []);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-semibold">API Status: {status}</span>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}