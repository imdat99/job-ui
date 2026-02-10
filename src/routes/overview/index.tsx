import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import Layout from '../../components/Layout';
import { getJobs, type Job } from '../../api';
import { useMqttEvent } from '../../mqtt';

type Tab = 'jobs' | 'settings';

function getStatusStyle(status: string) {
  // ... existing getStatusStyle ...
  switch (status) {
    case 'Running':
      return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
    case 'Pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'Completed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'Failed':
      return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
  }
}

function JobsPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchData = useCallback(async () => {
    // Only show loading on initial load or page change, not on background refresh
    if (jobs.length === 0) setLoading(true);
    try {
      const offset = page * limit;
      const data = await getJobs(offset, limit);
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, jobs.length]); // Added dependencies

  useEffect(() => {
    fetchData();
    // Poll every 5s, but only if we are on the first page to avoid shifting content while reading history
    let interval: ReturnType<typeof setInterval>;
    if (page === 0) {
      interval = setInterval(fetchData, 5000);
    }
    return () => clearInterval(interval);
  }, [fetchData, page]);

  // Subscribe to MQTT updates
  useMqttEvent('picpic:job-update', () => {
    // Re-fetch data on any job update if on first page
    if (page === 0) fetchData();
  });


  const handleNext = () => {
    setPage(p => p + 1);
  };

  const handlePrev = () => {
    setPage(p => Math.max(0, p - 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Active Jobs</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 0 || loading}
            className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm self-center text-slate-600">Page {page + 1}</span>
          <button
            onClick={handleNext}
            disabled={loading || jobs.length < limit}
            className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Started</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No jobs found.
                </td>
              </tr>
            )}
            {jobs.map((job) => {
              const statusStyle = getStatusStyle(job.status);
              // Calculate started relative time (mock logic for now or needs date-fns)
              const startedTime = job.t_start ? new Date(job.t_start).toLocaleTimeString() : '-';

              return (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${job.id}`} className="font-mono text-sm text-blue-600 hover:text-blue-700">
                      #{job.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${job.id}`} className="font-medium text-slate-900 hover:text-slate-700 truncate block max-w-[200px]" title={job.docker_image}>
                      {job.docker_image}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${job.status === 'Running' ? 'animate-pulse' : ''}`}></span>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{job.agent_id || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500">{startedTime}</span>
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
                defaultValue="picpic-render-cluster"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-transparent transition-all"
              />
            </div>
          </div>
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
