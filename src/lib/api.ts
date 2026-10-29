const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
    constructor(readonly status: number){
        super();
    }
}

async function post<T>(path: string, body: object ): Promise<T> {
    const res = await fetch(`${API_URL}${path}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new ApiError(res.status);
    }
    return res.json();
}

export const register = (username: string, email: string, password: string)  =>
    post<{ id: string; username:string }>('/auth/register', { username, email, password });

export const login = (username: string, password: string) =>
    post<{ accessToken: string }>('/auth/login', { username, password });

const MESSAGES: Record<number, string> = {
    400: 'Check the entered data',
    401: 'User or password are incorrect',
    409: 'Username or email already exists',
}

export function errorMessage(e: unknown){
    if(e instanceof ApiError){
        return MESSAGES[e.status] ?? 'Server Error. Please try again later';
    }
    return 'Could not connect to the server.';
}

