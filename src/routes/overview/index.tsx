import { useState } from 'react';
import { Link } from 'react-router';
import Layout from '../../components/Layout';

type Tab = 'jobs' | 'settings';

// Job data
const jobsData = [
  { id: '9281-AF', displayId: '#9281-AF', name: 'worker_video_transcode', status: 'Running', agent: 'agent-node-01', started: '2 mins ago', progress: 45 },
  { id: '9278-BC', displayId: '#9278-BC', name: 'db_daily_migration', status: 'Pending', agent: '--', started: 'Waiting...', progress: 0 },
  { id: '9275-XD', displayId: '#9275-XD', name: 'data_sync_pipeline', status: 'Running', agent: 'agent-node-02', started: '15 mins ago', progress: 78 },
  { id: '9272-ZK', displayId: '#9272-ZK', name: 'model_training_v2', status: 'Running', agent: 'agent-node-03', started: '1 hour ago', progress: 92 },
  { id: '9269-PM', displayId: '#9269-PM', name: 'cache_invalidation', status: 'Completed', agent: 'agent-node-01', started: '2 hours ago', progress: 100 },
];

function getStatusStyle(status: string) {
  switch (status) {
    case 'Running':
      return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
    case 'Pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'Completed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
  }
}

function JobsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Active Jobs</h2>
        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-sm text-slate-600">
          {jobsData.length} jobs
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Task ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Started</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobsData.map((job) => {
              const statusStyle = getStatusStyle(job.status);
              return (
                <tr 
                  key={job.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${job.id}`} className="font-mono text-sm text-blue-600 hover:text-blue-700">
                      {job.displayId}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${job.id}`} className="font-medium text-slate-900 hover:text-slate-700">
                      {job.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${job.status === 'Running' ? 'animate-pulse' : ''}`}></span>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            job.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-10">{job.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{job.agent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500">{job.started}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      to={`/jobs/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cluster Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cluster Name</label>
              <input 
                type="text" 
                defaultValue="us-east-cluster"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">API Endpoint</label>
              <input 
                type="text" 
                defaultValue="https://api.infra-control.us-east-1.example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Email notifications for job failures</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Agent health alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Weekly usage reports</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'jobs', label: 'Active Jobs' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <Layout tabItems={tabs} activeTab={activeTab} onTabChange={setActiveTab as (tabId: string) => void}>
      {activeTab === 'jobs' && <JobsPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </Layout>
  );
}
