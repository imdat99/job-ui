import mqtt from 'mqtt';

// Use environment variable or fallback to public broker from legacy code
const MQTT_URL = import.meta.env.VITE_MQTT_URL || 'ws://broker.mqtt-dashboard.com:8000/mqtt';

let client: mqtt.MqttClient | null = null;

export function initMqtt() {
    if (client) return;

    console.log('Connecting to MQTT:', MQTT_URL);
    client = mqtt.connect(MQTT_URL, {
        keepalive: 60,
        reconnectPeriod: 5000,
    });

    client.on('connect', () => {
        console.log('MQTT Connected');
        // Subscribe to relevant topics
        client?.subscribe('picpic/events');
        client?.subscribe('picpic/job/+');
        client?.subscribe('picpic/logs/#');
    });

    client.on('message', (topic, message) => {
        try {
            const payload = message.toString();
            console.debug('MQTT Message:', topic, payload);

            // Dispatch to handlers
            // Simple exact match or pattern match?
            // For now, let's just dispatch to listeners of the topic
            // modifying legacy logic: dispatch by event type?

            // Legacy logic:
            // if topic == 'picpic/events' -> handleWSMessage(msg)
            // if job_update -> window.dispatchEvent

            // Let's stick to a robust event emitter pattern
            // But for React, we might want to just expose a hook.

            // Let's stick to native CustomEvents for now as it decouples the react components
            // from the mqtt logic, similar to legacy app.

            let data: any;
            try {
                data = JSON.parse(payload);
            } catch {
                data = payload;
            }

            // Global events
            if (topic === 'picpic/events') {
                if (data.type === 'job_created' || data.type === 'job_cancelled' || data.type === 'job_update') {
                    window.dispatchEvent(new CustomEvent('picpic:job-update', { detail: data }));
                } else if (data.type === 'agent_update') {
                    window.dispatchEvent(new CustomEvent('picpic:agent-update', { detail: data }));
                }
            } else if (topic.startsWith('picpic/logs/')) {
                // topic: picpic/logs/{jobId}
                const jobId = topic.split('/').pop();
                window.dispatchEvent(new CustomEvent(`picpic:job-log:${jobId}`, { detail: data }));
            }

        } catch (e) {
            console.error('MQTT Handle Error', e);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
    });
}

import { useEffect } from 'react';

// Hook for subscribing to events
export function useMqttEvent<T>(eventName: string, callback: (data: T) => void) {
    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent;
            callback(customEvent.detail);
        };

        window.addEventListener(eventName, handler);
        return () => {
            window.removeEventListener(eventName, handler);
        };
    }, [eventName, callback]);
}

