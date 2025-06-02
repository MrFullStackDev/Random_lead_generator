// src/App.tsx
import React, { useState, useCallback } from 'react'
import { faker } from '@faker-js/faker'
import { Download, RefreshCw } from 'lucide-react'

interface Lead {
  firstName:    string
  lastName:     string
  phone:        string
  linkedinUrl:  string
  email:        string
  photoUrl:     string
  jobTitle:     string
  companyName:  string
  companyDomain:string
  city:         string
  state:        string
  country:      string
}

export default function App() {
  const [count, setCount] = useState<number>(10)
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState<string>('')
  const [customEmail, setCustomEmail] = useState<string>('')

  const generateLeads = useCallback((n: number): Lead[] =>
    Array.from({ length: n }).map(() => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      let email = `${firstName.toLowerCase()}${faker.number.int({ min: 100, max: 999 })}@rahulksm.testinator.com`
      if (customEmail && customEmail.includes('@')) {
        const [user, domain] = customEmail.split('@')
        email = `${user}+${faker.string.alphanumeric(8)}@${domain}`
      }
      return {
        firstName,
        lastName,
        phone: faker.phone.number({ style: 'national' }),
        linkedinUrl: `https://linkedin.com/in/${faker.internet.userName().toLowerCase()}`,
        email,
        photoUrl: 'https://ui-avatars.com/api/?background=random&size=200',
        jobTitle: faker.person.jobTitle(),
        companyName: faker.company.name().split(' ')[0],
        companyDomain: faker.internet.domainName(),
        city: faker.location.city().split(',')[0].split(' ')[0],
        state: faker.location.state(),
        country: faker.location.country(),
      }
    }), [customEmail])

  const handleGenerate = () => {
    try {
      setError('')
      setLeads(generateLeads(count))
    } catch (err) {
      setError('Failed to generate leads. Please try again.')
      console.error('Error generating leads:', err)
    }
  }

  const downloadCSV = () => {
    try {
      const headers = ['First Name','Last Name','Phone','Linkedin Url','Email','Photo Url','Job Title','Company Name','Company Domain','City','State','Country']
      const rows = [
        headers.join(','),
        ...leads.map(l =>
          [
            l.firstName,
            l.lastName,
            l.phone,
            l.linkedinUrl,
            l.email,
            l.photoUrl,
            l.jobTitle,
            l.companyName,
            l.companyDomain,
            l.city,
            l.state,
            l.country,
          ]
          .map(v => `"${String(v).replace(/"/g,'""').replace(/\n/g, ' ')}"`)
          .join(',')
        )
      ].join('\n')

      const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CSV_Leads_${leads.length}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download CSV. Please try again.')
      console.error('Error downloading CSV:', err)
    }
  }

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setCount(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-[98%] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight flex items-center justify-center">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Dummy Leads Generator</span>
          </h1>
          <p className="text-slate-600 text-sm">This is just for testing purposes, just enter the number and it will generate a random lead data for you to download and test.</p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-slate-200 space-y-4 sm:space-y-0 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <div className="flex items-center space-x-3">
                <label htmlFor="count" className="font-medium text-slate-700">
                  Number of Leads:
                </label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  value={count}
                  onChange={handleCountChange}
                  aria-label="Number of leads to generate"
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label htmlFor="customEmail" className="font-medium text-slate-700">
                  Custom Email Base:
                </label>
                <input
                  id="customEmail"
                  type="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  aria-label="Custom email base"
                  className="w-56 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-2 sm:mt-0">
              <button
                onClick={handleGenerate}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md active:scale-95"
                aria-label="Generate new leads"
              >
                <RefreshCw size={16} className="animate-spin-slow" />
                <span>Generate Leads</span>
              </button>
              <button
                onClick={downloadCSV}
                disabled={!leads.length}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md active:scale-95 disabled:hover:shadow-none"
                aria-label="Download leads as CSV"
              >
                <Download size={16} />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-b border-red-200 font-medium text-sm animate-fade-in">
              {error}
            </div>
          )}

          {leads.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      'First Name', 'Last Name', 'Phone', 'Linkedin Url', 'Email',
                      'Photo Url', 'Job Title', 'Company Name', 'Company Domain',
                      'City', 'State', 'Country'
                    ].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-4 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {leads.map((l, index) => (
                    <tr 
                      key={index} 
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-blue-50/50 transition-colors duration-150`}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.firstName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.lastName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.phone}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200 font-mono">{l.linkedinUrl}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.email}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200 font-mono">{l.photoUrl}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.jobTitle}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.companyName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.companyDomain}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.city}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.state}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-900 border-b border-slate-200">{l.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
