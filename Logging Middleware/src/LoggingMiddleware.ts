import axios from 'axios';
import { LogPayload, Stack, Level, Package } from './types';

export class LoggingMiddleware {
    private readonly apiUrl = 'http://20.244.56.144/evaluation-service/logs';
    private readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    public async log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
        try {
            this.validateParams(stack, level, pkg);

            const payload: LogPayload = {
                stack: stack.toLowerCase() as Stack,
                level: level.toLowerCase() as Level,
                package: pkg.toLowerCase() as Package,
                message
            };

            await axios.post(this.apiUrl, payload, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logging service error:', error instanceof Error ? error.message : 'Unknown error');
        }
    }

    private validateParams(stack: Stack, level: Level, pkg: Package): void {
        const validStacks = ['backend', 'frontend'];
        const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
        const validBackendPackages = ['handler', 'db', 'auth', 'cache', 'queue'];
        const validFrontendPackages = ['component', 'hook', 'page', 'state', 'style'];
        const validPackages = [...validBackendPackages, ...validFrontendPackages];

        const stackLower = stack.toLowerCase();
        const levelLower = level.toLowerCase();
        const pkgLower = pkg.toLowerCase();

        if (!validStacks.includes(stackLower)) {
            throw new Error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
        }

        if (!validLevels.includes(levelLower)) {
            throw new Error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
        }

        if (!validPackages.includes(pkgLower)) {
            throw new Error(`Invalid package: ${pkg}. Must be one of: ${validPackages.join(', ')}`);
        }

        
        if (stackLower === 'backend' && !validBackendPackages.includes(pkgLower)) {
            throw new Error(`Invalid backend package: ${pkg}. Must be one of: ${validBackendPackages.join(', ')}`);
        }
    }
}