const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 40_000;

export class ApiError extends Error {
    constructor(readonly status: number){
        super();
    }
}

let onUnauthorized = () => {};

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

async function request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    { token, body }: { token?: string; body?: object } = {}
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                ...(body ? { 'Content-Type': 'application/json' } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body && JSON.stringify(body),
            signal: controller.signal,
        });
        if (!res.ok) {
            if (res.status === 401 && token) onUnauthorized();
            throw new ApiError(res.status);
        }
        return res.status === 204 ? (undefined as T) : await res.json();
    } finally {
        clearTimeout(timer);
    }
}

export type Question = {
    id: string;
    position: number;
    question: string;
    options: string[];
    correct_answer?: string | null;
    user_answer?: string | null;
    is_correct?: boolean | null;
};

export type HistoryItem = {
    id: string;
    topic: string;
    created_at: string;
    correct: number;
    total: number;
    pending: boolean;
}

export type HistoryDetail = HistoryItem & { explanation: string };

export const register = (username: string, email: string, password: string)  =>
    request<{ id: string; username:string }>('POST','/auth/register', { body: { username, email, password } });

export const login = (username: string, password: string) =>
    request<{ accessToken: string }>('POST','/auth/login', { body: { username, password } });

export const study = (token: string, topic: string) =>
    request<{ sessionId: string; explanation: string }>('POST','/study', { token, body: { topic } });

export const getHistory = async (token: string) =>
    (await request<{ sessions: HistoryItem[] }>('GET','/study', { token })).sessions;

export const getHistoryDetail = (token: string, id: string) =>
    request<HistoryDetail>('GET', `/study/${id}`, { token });

export const getQuiz = async (token: string, sessionId: string) =>
    (await request<{ questions: Question[] }>('GET',`/quiz/${sessionId}`, { token })).questions;


export const answerQuestion = (token: string, sessionId: string, questionId: string, answer: string) =>
    request<{ isCorrect: boolean; correctAnswer: string }>('POST',`/quiz/${sessionId}/answer`, { token, body: { questionId, answer } });

export const deleteAccount = (token: string, password: string) =>
    request<void>('DELETE', '/auth/me', { token, body: { password } });

const MESSAGES: Record<number, string> = {
    400: 'Check the entered data',
    401: 'User or password are incorrect',
    403: 'Incorrect password',
    404: 'Resource not found',
    409: 'Username or email already exists',
    429: 'Too many requests. Try again in a minute',
    502: 'Could not generate the quiz. Try again',
}

export function errorMessage(e: unknown){
    if(e instanceof ApiError){
        return MESSAGES[e.status] ?? 'Server Error. Please try again later';
    }
    return 'Could not connect to the server.';
}

