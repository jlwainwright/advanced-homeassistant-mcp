import { mock } from "bun:test";
import type { Mock } from "bun:test";
import type { WebSocket } from 'ws';

// Common Types
export interface Tool {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    execute: (params: Record<string, unknown>) => Promise<unknown>;
}

export interface MockLiteMCPInstance {
    addTool: Mock<(tool: Tool) => void>;
    start: Mock<() => Promise<void>>;
}

export interface MockServices {
    light: {
        turn_on: Mock<() => Promise<{ success: boolean }>>;
        turn_off: Mock<() => Promise<{ success: boolean }>>;
    };
    climate: {
        set_temperature: Mock<() => Promise<{ success: boolean }>>;
    };
}

export interface MockHassInstance {
    services: MockServices;
}

export type TestResponse = {
    success: boolean;
    message?: string;
    automation_id?: string;
    new_automation_id?: string;
    state?: string;
    attributes?: Record<string, any>;
    states?: Array<{
        entity_id: string;
        state: string;
        attributes: Record<string, any>;
        last_changed: string;
        last_updated: string;
        context: {
            id: string;
            parent_id: string | null;
            user_id: string | null;
        };
    }>;
};

// Test Configuration
export const TEST_CONFIG = {
    HASS_HOST: process.env.TEST_HASS_HOST || 'http://localhost:8123',
    HASS_TOKEN: process.env.TEST_HASS_TOKEN || 'test_token',
    HASS_SOCKET_URL: process.env.TEST_HASS_SOCKET_URL || 'ws://localhost:8123/api/websocket'
} as const;

// Mock WebSocket Implementation
export class MockWebSocket {
    public static readonly CONNECTING = 0;
    public static readonly OPEN = 1;
    public static readonly CLOSING = 2;
    public static readonly CLOSED = 3;

    public readyState: 0 | 1 | 2 | 3 = MockWebSocket.OPEN;
    public bufferedAmount = 0;
    public extensions = '';
    public protocol = '';
    public url = '';
    public binaryType: 'arraybuffer' | 'nodebuffer' | 'fragments' = 'arraybuffer';

    public onopen: ((event: any) => void) | null = null;
    public onerror: ((event: any) => void) | null = null;
    public onclose: ((event: any) => void) | null = null;
    public onmessage: ((event: any) => void) | null = null;

    public addEventListener = mock(() => undefined);
    public removeEventListener = mock(() => undefined);
    public send = mock(() => undefined);
    public close = mock(() => undefined);
    public ping = mock(() => undefined);
    public pong = mock(() => undefined);
    public terminate = mock(() => undefined);

    constructor(url: string | URL, protocols?: string | string[]) {
        this.url = url.toString();
        if (protocols) {
            this.protocol = Array.isArray(protocols) ? protocols[0] : protocols;
        }
    }
}

// Mock Service Instances
export const createMockServices = (): MockServices => ({
    light: {
        turn_on: mock(() => Promise.resolve({ success: true })),
        turn_off: mock(() => Promise.resolve({ success: true }))
    },
    climate: {
        set_temperature: mock(() => Promise.resolve({ success: true }))
    }
});

export const createMockLiteMCPInstance = (): MockLiteMCPInstance => ({
    addTool: mock((tool: Tool) => undefined),
    start: mock(() => Promise.resolve())
});

// Helper Functions
export const createMockResponse = <T>(data: T, status = 200): Response => {
    return new Response(JSON.stringify(data), { status });
};

export const getMockCallArgs = <T extends unknown[]>(
    mock: Mock<(...args: any[]) => any>,
    callIndex = 0
): T | undefined => {
    const call = mock.mock.calls[callIndex];
    return call?.args as T | undefined;
};

export const setupTestEnvironment = () => {
    // Setup test environment variables
    Object.entries(TEST_CONFIG).forEach(([key, value]) => {
        process.env[key] = value;
    });

    // Create fetch mock
    const mockFetch = mock(() => Promise.resolve(createMockResponse({ state: 'connected' })));

    // Override globals
    globalThis.fetch = mockFetch;
    globalThis.WebSocket = MockWebSocket as any;

    return { mockFetch };
};

export const cleanupMocks = (mocks: {
    liteMcpInstance: MockLiteMCPInstance;
    mockFetch: Mock<() => Promise<Response>>;
}) => {
    // Reset mock calls by creating a new mock
    mocks.liteMcpInstance.addTool = mock((tool: Tool) => undefined);
    mocks.liteMcpInstance.start = mock(() => Promise.resolve());
    mocks.mockFetch = mock(() => Promise.resolve(new Response()));
    globalThis.fetch = mocks.mockFetch;
}; 