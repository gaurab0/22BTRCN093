import { LoggingMiddleware } from './LoggingMiddleware';
import { getAuthToken, AuthPayload } from './auth';

const authPayload: AuthPayload = {
    email: "your.email@example.com",
    name: "Your Name",
    rollNo: "22BTRCN093",
    accessCode: "your-access-code",
    clientId: "your-client-id",
    clientSecret: "your-client-secret"
};

// Initialize the logging middleware with authentication
let logger: LoggingMiddleware;

async function initializeLogger() {
    try {
        const token = await getAuthToken(authPayload);
        logger = new LoggingMiddleware(token);
        console.log('Logger initialized successfully');
    } catch (error) {
        console.error('Failed to initialize logger:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}

// Example usage in a backend application

// Example 1: Logging a data type mismatch error in handler
async function handleUserRequest(data: unknown) {
    try {
        if (typeof data !== 'boolean') {
            await logger.log('backend', 'error', 'handler', 'received string, expected bool');
            throw new Error('Invalid data type');
        }
        // Process the boolean data...
    } catch (error) {
        // Log any other errors
        await logger.log('backend', 'error', 'handler', `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Example 2: Logging a database connection failure
async function connectToDatabase() {
    try {
        // Database connection code...
        throw new Error('Database connection failed');
    } catch (error) {
        await logger.log('backend', 'fatal', 'db', 'critical database connection failure.');
        // Additional error handling...
    }
}

// Example usage
async function runExamples() {
    // Example of data type mismatch
    await handleUserRequest("not a boolean");

    // Example of database connection failure
    await connectToDatabase();
}

runExamples().catch(console.error);