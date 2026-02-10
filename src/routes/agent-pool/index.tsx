import { Button, Modal } from '@douyinfe/semi-ui-19';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAgents, type Agent, restartAgent } from '../../api';

function getStatusStyle(status: string) {
  switch (status) {
    case 'Active':
    case 'online': // Handle lower case from backend if needed
      return { color: '#10b981', bg: '#ecfdf5' };
    case 'Idle':
      return { color: '#3b82f6', bg: '#eff6ff' };
    case 'Offline':
    case 'offline':
      return { color: '#6b7280', bg: '#f3f4f6' };
    default:
      return { color: '#6b7280', bg: '#f3f4f6' };
  }
}

interface AgentModalProps {
  agent: Agent | null;
  visible: boolean;
  onClose: () => void;
}

function AgentModal({ agent, visible, onClose }: AgentModalProps) {
  if (!agent) return null;

  const statusStyle = getStatusStyle(agent.status);
  // Mock CPU/Mem for now as backend doesn't provide real-time stats in Agent struct yet
  // Or we can add it to the struct later. For now, display standard or parse from CustomLabels if available?
  // The current Agent struct has Capacity.
  const cpu = 0; // Placeholder
  const memPercent = 0; // Placeholder
  const cpuColor = cpu > 80 ? '#ef4444' : cpu > 50 ? '#f59e0b' : '#0f172a';

  const handleRestart = async () => {
    try {
      // Assuming we have an endpoint for this, or just log for now
      // The api.ts has restartAgent (implied to be added)
      await restartAgent(agent.id.toString());
      onClose();
    } catch (e) {
      console.error("Failed to restart agent", e);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button type="primary" theme="solid" onClick={handleRestart}>
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
            <div className="text-lg font-semibold text-slate-900">{agent.name}</div>
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
                style={{ width: `${cpu}%`, backgroundColor: cpuColor }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-900">{cpu}%</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">Memory</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${memPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-900">{memPercent}%</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">Backend</div>
          <div className="font-mono text-sm text-slate-900">{agent.backend}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-1">Last Heartbeat</div>
          <div className="text-sm font-semibold text-slate-900">{agent.last_heartbeat ? new Date(agent.last_heartbeat).toLocaleTimeString() : '-'}</div>
        </div>
      </div>

      {/* Jobs Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm font-semibold text-slate-900">
            Capacity ({agent.capacity})
          </span>
        </div>

        <div className="text-sm text-slate-500 italic py-4 text-center bg-slate-50 rounded-lg">
          Job list per agent not yet implemented in backend API
        </div>
      </div>
    </Modal>
  );
}

export default function AgentPool() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeAgents = agents.filter(a => a.status === 'Active').length;
  // Backend might not return Idle/Offline status explicitly yet, usually just presence or last heartbeat check.
  // Assuming 'Active' is the main status for now.
  const idleAgents = agents.length - activeAgents;
  const offlineAgents = 0; // Placeholder until backend supports history

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') {
      const statusOrder = { 'Active': 0, 'Idle': 1, 'Offline': 2 };
      return (statusOrder[a.status as keyof typeof statusOrder] ?? 3) - (statusOrder[b.status as keyof typeof statusOrder] ?? 3);
    }
    return 0;
  });

  const handleAgentClick = (agent: Agent) => {
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
              <div className="text-sm text-slate-500">Total/Idle</div>
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
            onChange={(e) => setSortBy(e.target.value as 'name' | 'status')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Backend</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Heartbeat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAgents.map((agent) => {
              const statusStyle = getStatusStyle(agent.status);

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
                        <div className="font-medium text-slate-900">{agent.name}</div>
                        <div className="text-xs text-slate-500">{agent.id}</div>
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
                      <span className="text-sm font-medium text-slate-700">{agent.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{agent.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-slate-600">{agent.backend}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{agent.last_heartbeat ? new Date(agent.last_heartbeat).toLocaleString() : '-'}</span>
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
