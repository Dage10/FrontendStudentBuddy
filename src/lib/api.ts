const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 40_000;

export class ApiError extends Error {
    constructor(readonly status: number){
        super();
    }
}

async function post<T>(path: string, body: object, token?: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        if (!res.ok) {
            throw new ApiError(res.status);
        }
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

async function get<T>(path: string, token: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
        if (!res.ok) {
            throw new ApiError(res.status);
        }
        return await res.json();
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

export const register = (username: string, email: string, password: string)  =>
    post<{ id: string; username:string }>('/auth/register', { username, email, password });

export const login = (username: string, password: string) =>
    post<{ accessToken: string }>('/auth/login', { username, password });

export const study = (token: string, topic: string) =>
    post<{ sessionId: string; explanation: string }>('/study', { topic }, token);

export const getQuiz = async (token: string, sessionId: string) => {
    const data = await get<{ questions: Question[] }>(`/quiz/${sessionId}`, token);
    return data.questions;
}

export const answerQuestion = (token: string, sessionId: string, questionId: string, answer: string) =>
    post<{ isCorrect: boolean; correctAnswer: string }>(`/quiz/${sessionId}/answer`, { questionId, answer }, token);

const MESSAGES: Record<number, string> = {
    400: 'Check the entered data',
    401: 'User or password are incorrect',
    403: 'Access denied',
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

