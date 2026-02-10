import { Link, useParams } from 'react-router';
import Layout from '../../components/Layout';

// Job data with logs
const jobsData: Record<string, {
  id: string;
  displayId: string;
  name: string;
  status: string;
  agent: string;
  started: string;
  progress: number;
  logs: { time: string; message: string }[];
}> = {
  '9281-AF': {
    id: '9281-AF',
    displayId: '#9281-AF',
    name: 'worker_video_transcode',
    status: 'Running',
    agent: 'agent-node-01',
    started: '2 mins ago',
    progress: 45,
    logs: [
      { time: '09:28:15', message: 'Job started' },
      { time: '09:28:16', message: 'Loading video file: input.mp4' },
      { time: '09:28:17', message: 'Transcoding: 45% complete' },
      { time: '09:28:18', message: 'Output: output_1080p.mp4' },
    ],
  },
  '9278-BC': {
    id: '9278-BC',
    displayId: '#9278-BC',
    name: 'db_daily_migration',
    status: 'Pending',
    agent: '--',
    started: 'Waiting...',
    progress: 0,
    logs: [
      { time: '09:25:00', message: 'Job queued' },
      { time: '09:25:01', message: 'Waiting for available agent' },
    ],
  },
  '9275-XD': {
    id: '9275-XD',
    displayId: '#9275-XD',
    name: 'data_sync_pipeline',
    status: 'Running',
    agent: 'agent-node-02',
    started: '15 mins ago',
    progress: 78,
    logs: [
      { time: '09:13:22', message: 'Job started' },
      { time: '09:13:23', message: 'Connecting to source database...' },
      { time: '09:13:24', message: 'Syncing tables: users, orders, products' },
      { time: '09:13:25', message: 'Sync progress: 78%' },
    ],
  },
  '9272-ZK': {
    id: '9272-ZK',
    displayId: '#9272-ZK',
    name: 'model_training_v2',
    status: 'Running',
    agent: 'agent-node-03',
    started: '1 hour ago',
    progress: 92,
    logs: [
      { time: '08:28:10', message: 'Job started' },
      { time: '08:28:11', message: 'Loading training data...' },
      { time: '08:28:12', message: 'Epoch 1/10 completed' },
      { time: '08:28:13', message: 'Epoch 10/10 completed' },
      { time: '08:28:14', message: 'Final accuracy: 94.5%' },
    ],
  },
  '9269-PM': {
    id: '9269-PM',
    displayId: '#9269-PM',
    name: 'cache_invalidation',
    status: 'Completed',
    agent: 'agent-node-01',
    started: '2 hours ago',
    progress: 100,
    logs: [
      { time: '07:28:00', message: 'Job started' },
      { time: '07:28:01', message: 'Invalidating cache keys...' },
      { time: '07:28:02', message: 'Cleared 1,234 cache entries' },
      { time: '07:28:03', message: 'Job completed successfully' },
    ],
  },
};

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

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobId ? jobsData[jobId] : null;

  if (!job) {
    return (
      <Layout title="Job Not Found">
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Job Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Jobs
          </Link>
        </div>
      </Layout>
    );
  }

  const statusStyle = getStatusStyle(job.status);

  return (
    <Layout title={job.name}>
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
              {job.name}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot} ${job.status === 'Running' ? 'animate-pulse' : ''}`}></span>
                {job.status}
              </span>
            </h1>
            <p className="text-slate-500 mt-1">Task ID: <span className="font-mono text-slate-700">{job.displayId}</span></p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel Job
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              Restart Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Progress</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  job.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <span className="text-xl font-bold text-slate-900">{job.progress}%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Agent</div>
          <div className="font-semibold text-slate-900">{job.agent}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Started</div>
          <div className="font-semibold text-slate-900">{job.started}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-2">Logs</div>
          <div className="font-semibold text-slate-900">{job.logs.length} entries</div>
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
            {job.logs.map((log, index) => (
              <div key={index} className="flex gap-4 hover:bg-slate-800/50 -mx-2 px-2 py-0.5 rounded">
                <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
