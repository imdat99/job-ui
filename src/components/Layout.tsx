import { Button, Input, Modal, Select, TextArea } from '@douyinfe/semi-ui-19';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

interface TabItem {
  id: string;
  label: string;
}

interface LayoutProps {
  children: React.ReactNode;
  tabItems?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  title?: string;
}

export default function Layout({ children, tabItems, activeTab: externalActiveTab, onTabChange, title }: LayoutProps) {
  const location = useLocation();
  const isOverview = location.pathname === '/';
  const isAgents = location.pathname === '/agents';
  const [createJobVisible, setCreateJobVisible] = useState(false);

  // Default tabs for Overview page
  const defaultTabs: TabItem[] = [
    { id: 'jobs', label: 'Active Jobs' },
    { id: 'settings', label: 'Settings' },
  ];

  const [internalActiveTab, setInternalActiveTab] = useState<string>('jobs');
  const activeTab = externalActiveTab ?? internalActiveTab;
  const tabs = tabItems ?? defaultTabs;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-wide">INFRA<span className="text-slate-400">CONTROL</span></span>
        </div>
        
        <nav className="p-4 space-y-1 flex-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isOverview 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </Link>
          <Link
            to="/agents"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isAgents 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Agents
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Connected</span>
            </div>
            <div className="text-sm text-white font-medium">us-east-cluster</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Infrastructure</span>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-900 font-medium">{title || (isAgents ? 'Agent Pool' : 'Overview')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">System Healthy</span>
            </div>
            <Button 
              type="primary" 
              theme="solid"
              onClick={() => setCreateJobVisible(true)}
            >
              Create Job
            </Button>
          </div>
        </header>

        {/* Tabs - Only show if tabItems are provided */}
        {tabItems && (
          <div className="px-8 bg-white border-b border-slate-200">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Create Job Modal */}
      <Modal
        visible={createJobVisible}
        onCancel={() => setCreateJobVisible(false)}
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold text-slate-900">Create New Job</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateJobVisible(false)}>Cancel</Button>
            <Button type="primary" theme="solid" onClick={() => {
              // Handle create job
              setCreateJobVisible(false);
            }}>
              Create Job
            </Button>
          </div>
        }
        headerStyle={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}
        bodyStyle={{ padding: '24px' }}
        style={{ width: 500, borderRadius: 16 }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Name</label>
            <Input placeholder="Enter job name" style={{ width: '100%' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Agent</label>
            <Select 
              placeholder="Select agent" 
              style={{ width: '100%' }}
            >
              <Select.Option value="worker-node-01">worker-node-01</Select.Option>
              <Select.Option value="worker-node-02">worker-node-02</Select.Option>
              <Select.Option value="worker-node-03">worker-node-03</Select.Option>
              <Select.Option value="auto">Auto-assign</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
            <Select 
              placeholder="Select job type" 
              style={{ width: '100%' }}
            >
              <Select.Option value="transcode">Video Transcode</Select.Option>
              <Select.Option value="migration">Data Migration</Select.Option>
              <Select.Option value="sync">Data Sync</Select.Option>
              <Select.Option value="training">Model Training</Select.Option>
              <Select.Option value="batch">Batch Processing</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <TextArea 
              placeholder="Enter job description (optional)" 
              style={{ width: '100%' }}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
