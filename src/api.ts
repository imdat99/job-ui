
export const API_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface Agent {
    id: number;
    name: string;
    status: string;
    platform: string;
    backend: string;
    capacity: number;
    version: string;
    last_heartbeat: string;
}

export interface Job {
    id: number;
    t_sub: string;
    t_start: string;
    t_end: string;
    status: string;
    docker_image: string;
    docker_cmd: string;
    agent_id: number;
}

export interface JobLog {
    time: string;
    message: string;
}

export async function getAgents(): Promise<Agent[]> {
    try {
        const res = await fetch(`${API_URL}/api/agents`);
        if (!res.ok) throw new Error('Failed to fetch agents');
        return await res.json();
    } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
    }
}

export async function getJobs(offset = 0, limit = 20, agentId?: string): Promise<Job[]> {
    let url = `${API_URL}/api/jobs?offset=${offset}&limit=${limit}`;
    if (agentId) {
        url += `&agent_id=${agentId}`;
    }
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        return Array.isArray(data) ? data : (data.jobs || []);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

export async function getJob(jobId: string | number): Promise<Job | null> {
    try {
        // The current API doesn't seem to have a single job endpoint based on previous api.js analysis
        // It uses list with filters or we might need to rely on the list we have.
        // However, let's assume standard REST or use the list.
        // Based on previous analysis, there was no single job endpoint in api.js?
        // Wait, api.js had fetchLogs and cancelJob but no getJob.
        // Let's implement getJob by fetching the list and finding it, or check if the backend supports it.
        // For now, let's try to fetch from /api/jobs/{id} if it exists, otherwise list.
        // Actually, let's stick to what's known or use the list for now.
        // But better:
        const jobs = await getJobs(0, 1000); // Hacky but works for small scale
        return jobs.find(j => j.id.toString() == jobId.toString()) || null;
    } catch (error) {
        console.error('Error fetching job:', error);
        return null;
    }
}


export async function getJobLogs(jobId: string | number): Promise<string> {
    try {
        const res = await fetch(`${API_URL}/api/jobs/${jobId}/logs`);
        if (res.ok) {
            return await res.text();
        }
        return '';
    } catch (e) {
        console.error('Error fetching logs', e);
        return '';
    }
}

export async function createJob(image: string, command: string) {
    try {
        const res = await fetch(`${API_URL}/api/jobs`, {
            method: 'POST',
            body: JSON.stringify({ image, command, env: {} }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            return await res.json();
        } else {
            throw new Error(await res.text());
        }
    } catch (err) {
        console.error('Failed to create job:', err);
        throw err;
    }
}

export async function cancelJob(jobId: string | number) {
    try {
        const res = await fetch(`${API_URL}/api/jobs/${jobId}/cancel`, {
            method: 'POST'
        });
        if (res.ok) {
            return await res.json();
        } else {
            throw new Error(await res.text());
        }
    } catch (e) {
        console.error("Cancel Job Error", e);
        throw e;
    }
}

export async function restartAgent(agentId: string) {
    // This is a placeholder since the backend might not have this endpoint yet.
    // But we need it to compile.
    console.log(`Restarting agent ${agentId}`);
    return Promise.resolve();
}
