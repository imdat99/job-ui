import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getJob, getJobLogs, cancelJob, type Job } from '../../api';
import { useMqttEvent } from '../../mqtt';

function getStatusStyle(status: string) {
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

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId) return;

    const fetchData = async () => {
      try {
        const j = await getJob(jobId);
        setJob(j);
        if (j) {
          const l = await getJobLogs(jobId);
          setLogs(l);
        } else {
          setError('Job not found');
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll for logs if running?
    const interval = setInterval(() => {
      if (job && job.status === 'Running') {
        getJobLogs(jobId).then(setLogs).catch(console.error);
        getJob(jobId).then(j => j && setJob(j)).catch(console.error);
      }
    }, 5000); // Reduce polling frequency since we have MQTT

    return () => clearInterval(interval);
  }, [jobId, job?.status]); // Add job.status dependency to poll only when running roughly

  // Subscribe to real-time logs
  useMqttEvent(`picpic:job-log:${jobId}`, (data: any) => {
    let line = '';
    if (typeof data === 'string') line = data;
    else if (data && data.message) line = data.message;
    else if (data && data.content) line = data.content;

    if (line) {
      setLogs(prev => prev + (prev ? '\n' : '') + line);
    }
  });

  // Also listen for status updates for this job
  useMqttEvent('picpic:job-update', (data: any) => {
    if (data && (data.id == jobId || data.job_id == jobId)) {
      // Reload job info
      getJob(jobId!).then(j => j && setJob(j));
    }
  });

  const handleCancel = async () => {
    if (!job) return;
    try {
      await cancelJob(job.id);
      // Refresh
      const updated = await getJob(job.id);
      setJob(updated);
    } catch (e) {
      console.error(e);
      alert('Failed to cancel job');
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </Layout>
    );
  }

  if (!job || error) {
    return (
      <Layout title="Job Not Found">
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">{error || 'Job Not Found'}</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Jobs
          </Link>
        </div>
      </Layout>
    );
  }

  const statusStyle = getStatusStyle(job.status);
  // Parse logs
  // Logs from backend are likely plain text lines.
  const logLines = logs.split('\n').filter(Boolean).map(line => {
    // Try to parse timestamp? For now just raw check
    // Simple heuristic if line starts with timestamp like [2023...] or just raw
    return { time: '', message: line };
  });

  return (
    <Layout title={`Job #${job.id}`}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {job.docker_image}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot} ${job.status === 'Running' ? 'animate-pulse' : ''}`}></span>
                {job.status}
              </span>
            </h1>
            <p className="text-slate-500 mt-1">ID: <span className="font-mono text-slate-700">{job.id}</span></p>
          </div>
          <div className="flex gap-3">
            {job.status === 'Running' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Cancel Job
              </button>
            )}
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              Restart Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Duration</div>
          {/* Mock duration */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-900">
              {job.t_end ?
                (new Date(job.t_end).getTime() - new Date(job.t_start).getTime()) / 1000 + 's'
                : 'Running...'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Agent</div>
          <div className="font-semibold text-slate-900">{job.agent_id}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Started</div>
          <div className="font-semibold text-slate-900">{new Date(job.t_start).toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Logs</div>
          <div className="font-semibold text-slate-900">{logLines.length} lines</div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Job Logs
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Download Logs
          </button>
        </div>
        <div className="bg-slate-900 p-6 max-h-96 overflow-y-auto">
          <div className="space-y-1 font-mono text-sm">
            {logLines.map((log, index) => (
              <div key={index} className="flex gap-4 hover:bg-slate-800/50 -mx-2 px-2 py-0.5 rounded">
                <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            {logLines.length === 0 && (
              <div className="text-slate-500 italic">No logs available</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
