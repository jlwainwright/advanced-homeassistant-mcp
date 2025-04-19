import { beforeAll, afterAll } from 'bun:test';

// Mock environment variables for testing
const TEST_ENV = {
    NODE_ENV: 'test',
    PORT: '3000',
    EXECUTION_TIMEOUT: '30000',
    STREAMING_ENABLED: 'false',
    USE_STDIO_TRANSPORT: 'false',
    USE_HTTP_TRANSPORT: 'true',
    DEBUG_MODE: 'false',
    DEBUG_STDIO: 'false',
    DEBUG_HTTP: 'false',
    SILENT_STARTUP: 'false',
    CORS_ORIGIN: '*',
    RATE_LIMIT_MAX_REQUESTS: '100',
    RATE_LIMIT_MAX_AUTH_REQUESTS: '5'
};

beforeAll(() => {
    // Store original environment
    process.env = {
        ...process.env,
        ...TEST_ENV
    };
});

afterAll(() => {
    // Clean up test environment
    Object.keys(TEST_ENV).forEach(key => {
        delete process.env[key];
    });
}); 