type MessageCallback = (message: any) => void;

class PixsoEventBus {
    private listeners: { [key: string]: MessageCallback[] } = {};

    constructor() {
        this.setupGlobalListener();
    }

    private setupGlobalListener(): void {
        window.addEventListener('message', (event) => {
            const message = event.data.pluginMessage;
            if (message && this.listeners[message.type]) {
                this.listeners[message.type].forEach((callback) => callback(message));
            }
        });
    }

    on(messageType: string, callback: MessageCallback): void {
        if (!this.listeners[messageType]) {
            this.listeners[messageType] = [];
        }
        this.listeners[messageType].push(callback);
    }

    off(messageType: string, callback: MessageCallback): void {
        if (this.listeners[messageType]) {
            this.listeners[messageType] = this.listeners[messageType].filter((cb) => cb !== callback);
        }
    }

    removeAllListeners(messageType?: string): void {
        if (messageType) {
            delete this.listeners[messageType];
        } else {
            this.listeners = {};
        }
    }
}

export const pixsoEventBus = new PixsoEventBus();
