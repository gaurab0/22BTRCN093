export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type BackendPackage = 'handler' | 'db' | 'auth' | 'cache' | 'queue';
export type FrontendPackage = 'component' | 'hook' | 'page' | 'state' | 'style';
export type Package = BackendPackage | FrontendPackage;
export interface LogPayload {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
}