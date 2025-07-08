"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestDBPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [seedResult, setSeedResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const result = await response.json()
      setTestResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const result = await response.json()
      setSeedResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setSeedResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Database Connection Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Database Connection</h2>
            <Button 
              onClick={testConnection} 
              disabled={loading}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-64">
              <pre>{testResult || 'Click "Test Connection" to see results'}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Seed Database</h2>
            <Button 
              onClick={seedDatabase} 
              disabled={loading}
              className="w-full mb-4 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </Button>
            <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-64">
              <pre>{seedResult || 'Click "Seed Database" to add sample data'}</pre>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure XAMPP is running and MySQL service is started</li>
            <li>Open phpMyAdmin at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost/phpmyadmin</code></li>
            <li>Click "Test Connection" to verify database connectivity</li>
            <li>Click "Seed Database" to add sample food items</li>
            <li>Go back to the home page to see the data from the database</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-[#01563A] hover:bg-[#014a30]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
} 