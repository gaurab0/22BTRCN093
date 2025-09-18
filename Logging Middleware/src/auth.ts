import axios from 'axios';

export interface AuthPayload {
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
    clientId: string;
    clientSecret: string;
}

interface AuthResponse {
    token: string;
}
export async function getAuthToken(credentials: AuthPayload): Promise<string> {
    try {
        const response = await axios.post<AuthResponse>(
            'http://20.244.56.144/evalutation-service/auth',
            credentials,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data.token;
    } catch (error) {
        console.error('Authentication failed:', error instanceof Error ? error.message : 'Unknown error');
        throw new Error('Failed to obtain authentication token');
    }
}