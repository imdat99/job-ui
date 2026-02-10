import { Button, Modal } from '@douyinfe/semi-ui-19';
import { useState } from 'react';
import Layout from '../../components/Layout';

// Agent data with jobs
const agentsData = [
  {
    id: 'worker-node-01',
    status: 'Active',
    cpu: 42,
    mem: '1.2GB / 8GB',
    memPercent: 15,
    ip: '192.168.1.101',
    uptime: '14d 3h 22m',
    region: 'us-east-1',
    jobs: [
      { id: '#9281-AF', name: 'worker_video_transcode', status: 'Running', started: '2 mins ago' },
      { id: '#9269-PM', name: 'cache_invalidation', status: 'Running', started: '45 mins ago' },
    ],
  },
  {
    id: 'worker-node-02',
    status: 'Active',
    cpu: 68,
    mem: '3.5GB / 8GB',
    memPercent: 44,
    ip: '192.168.1.102',
    uptime: '7d 12h 5m',
    region: 'us-east-1',
    jobs: [
      { id: '#9275-XD', name: 'data_sync_pipeline', status: 'Running', started: '15 mins ago' },
    ],
  },
  {
    id: 'worker-node-03',
    status: 'Active',
    cpu: 25,
    mem: '0.8GB / 8GB',
    memPercent: 10,
    ip: '192.168.1.103',
    uptime: '21d 8h 45m',
    region: 'us-east-1',
    jobs: [
      { id: '#9272-ZK', name: 'model_training_v2', status: 'Running', started: '1 hour ago' },
    ],
  },
  {
    id: 'worker-node-04',
    status: 'Idle',
    cpu: 5,
    mem: '0.5GB / 8GB',
    memPercent: 6,
    ip: '192.168.1.104',
    uptime: '2d 1h 12m',
    region: 'us-east-1',
    jobs: [],
  },
  {
    id: 'worker-node-05',
    status: 'Active',
    cpu: 89,
    mem: '6.1GB / 8GB',
    memPercent: 76,
    ip: '192.168.1.105',
    uptime: '5d 6h 30m',
    region: 'us-west-2',
    jobs: [
      { id: '#9285-PQ', name: 'batch_processing', status: 'Running', started: '5 mins ago' },
      { id: '#9283-RS', name: 'report_generation', status: 'Running', started: '12 mins ago' },
      { id: '#9280-TU', name: 'data_analysis', status: 'Running', started: '30 mins ago' },
    ],
  },
  {
    id: 'worker-node-06',
    status: 'Offline',
    cpu: 0,
    mem: '0GB / 8GB',
    memPercent: 0,
    ip: '192.168.1.106',
    uptime: '-',
    region: 'eu-west-1',
    jobs: [],
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case 'Active':
      return { color: '#10b981', bg: '#ecfdf5' };
    case 'Idle':
      return { color: '#3b82f6', bg: '#eff6ff' };
    case 'Offline':
      return { color: '#6b7280', bg: '#f3f4f6' };
    default:
      return { color: '#6b7280', bg: '#f3f4f6' };
  }
}

interface AgentModalProps {
  agent: typeof agentsData[0] | null;
  visible: boolean;
  onClose: () => void;
}

function AgentModal({ agent, visible, onClose }: AgentModalProps) {
  if (!agent) return null;

  const statusStyle = getStatusStyle(agent.status);
  const cpuColor = agent.cpu > 80 ? '#ef4444' : agent.cpu > 50 ? '#f59e0b' : '#0f172a';

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button type="primary" theme="solid" onClick={() => {}}>
            Restart Agent
          </Button>
        </div>
      }
      headerStyle={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}
      bodyStyle={{ padding: '24px' }}
      title={
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: statusStyle.bg }}
          >
            <svg 
              className="w-5 h-5"
              style={{ color: statusStyle.color }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">{agent.id}</div>
            <span 
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusStyle.color, animation: agent.status === 'Active' ? 'pulse 1.5s infinite' : 'none' }}
              ></span>
              {agent.status}
            </span>
          </div>
        </div>
      }
      style={{ width: 600, borderRadius: 16 }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">CPU</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${agent.cpu}%`, backgroundColor: cpuColor }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-900">{agent.cpu}%</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">Memory</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${agent.memPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-900">{agent.memPercent}%</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">IP Address</div>
          <div className="font-mono text-sm text-slate-900">{agent.ip}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">Uptime</div>
          <div className="text-sm font-semibold text-slate-900">{agent.uptime}</div>
        </div>
      </div>

      {/* Jobs Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm font-semibold text-slate-900">
            Running Jobs ({agent.jobs.length})
          </span>
        </div>
        
        {agent.jobs.length > 0 ? (
          <div className="space-y-2">
            {agent.jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-blue-600">{job.id}</span>
                  <span className="font-medium text-slate-900">{job.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    {job.status}
                  </span>
                  <span className="text-sm text-slate-500">{job.started}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic py-4 text-center bg-slate-50 rounded-lg">
            No jobs running on this agent
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function AgentPool() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agentsData[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'cpu'>('name');

  const activeAgents = agentsData.filter(a => a.status === 'Active').length;
  const idleAgents = agentsData.filter(a => a.status === 'Idle').length;
  const offlineAgents = agentsData.filter(a => a.status === 'Offline').length;

  const sortedAgents = [...agentsData].sort((a, b) => {
    if (sortBy === 'name') return a.id.localeCompare(b.id);
    if (sortBy === 'status') {
      const statusOrder = { 'Active': 0, 'Idle': 1, 'Offline': 2 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
    if (sortBy === 'cpu') return b.cpu - a.cpu;
    return 0;
  });

  const handleAgentClick = (agent: typeof agentsData[0]) => {
    setSelectedAgent(agent);
    setModalVisible(true);
  };

  return (
    <Layout title="Agent Pool">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{activeAgents}</div>
              <div className="text-sm text-slate-500">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{idleAgents}</div>
              <div className="text-sm text-slate-500">Idle</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{offlineAgents}</div>
              <div className="text-sm text-slate-500">Offline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Sort */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Agent Pool</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'name' | 'status' | 'cpu')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="cpu">CPU Usage</option>
          </select>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">CPU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Memory</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Uptime</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jobs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAgents.map((agent) => {
              const statusStyle = getStatusStyle(agent.status);
              const cpuColor = agent.cpu > 80 ? '#ef4444' : agent.cpu > 50 ? '#f59e0b' : '#0f172a';

              return (
                <tr 
                  key={agent.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => handleAgentClick(agent)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: statusStyle.bg }}
                      >
                        <svg 
                          className="w-4 h-4"
                          style={{ color: statusStyle.color }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{agent.id}</div>
                        <div className="text-xs text-slate-500">{agent.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: statusStyle.color, animation: agent.status === 'Active' ? 'pulse 1.5s infinite' : 'none' }}
                      ></span>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${agent.cpu}%`, backgroundColor: cpuColor }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700 w-10">{agent.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${agent.memPercent}%` }}></div>
                      </div>
                      <span className="text-sm text-slate-500 w-16">{agent.mem}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-slate-600">{agent.ip}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{agent.uptime}</span>
                  </td>
                  <td className="px-4 py-4">
                    {agent.jobs.length > 0 ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                        {agent.jobs.length} running
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AgentModal 
        agent={selectedAgent} 
        visible={modalVisible} 
        onClose={() => {
          setModalVisible(false);
          setSelectedAgent(null);
        }} 
      />
    </Layout>
  );
}
