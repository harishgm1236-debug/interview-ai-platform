// lib/api.ts - Fully typed API functions

import type {
  AuthResponse,
  SessionData,
  EvaluationResponse,
  CurrentScore,
  FinalResult,
  HistoryResponse,
  InterviewRecord,
  AnalyticsData,
  AdminDashboard,
  AdminUsersResponse,
  SessionResponse,
  User,
} from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
const AI_URL = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";

// Helper to get auth headers
function getHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Generic error handler
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json() as Promise<T>;
}

// =================== AUTH ===================
export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function getMe(): Promise<{ user: User }> {
  const res = await fetch(`${BACKEND_URL}/auth/me`, { headers: getHeaders() });
  return handleResponse<{ user: User }>(res);
}

// =================== INTERVIEW ===================
export async function startInterview(domain: string, level: string): Promise<SessionData> {
  const res = await fetch(`${BACKEND_URL}/interview/start`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ domain, level }),
  });
  return handleResponse<SessionData>(res);
}

export async function evaluateAnswer(
  session_id: string,
  index: number,
  answer_text: string,
  imageBlob: Blob,
  audioBlob: Blob
): Promise<EvaluationResponse> {
  const formData = new FormData();
  formData.append("session_id", session_id);
  formData.append("index", index.toString());
  formData.append("answer_text", answer_text || "");
  formData.append("image", imageBlob, "frame.jpg");
  formData.append("audio", audioBlob, "audio.wav");

  const res = await fetch(`${AI_URL}/interview/evaluate`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<EvaluationResponse>(res);
}

export async function saveResult(
  interviewId: string,
  scoreData: CurrentScore,
  isFinished: boolean,
  finalResult?: FinalResult
): Promise<{ success: boolean }> {
  const res = await fetch(`${BACKEND_URL}/interview/save-result`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ interviewId, scoreData, isFinished, finalResult }),
  });
  return handleResponse<{ success: boolean }>(res);
}

export async function getHistory(page = 1, limit = 10): Promise<HistoryResponse> {
  const res = await fetch(
    `${BACKEND_URL}/interview/history?page=${page}&limit=${limit}`,
    { headers: getHeaders() }
  );
  return handleResponse<HistoryResponse>(res);
}

export async function getInterviewResult(id: string): Promise<{ interview: InterviewRecord }> {
  const res = await fetch(`${BACKEND_URL}/interview/result/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse<{ interview: InterviewRecord }>(res);
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${BACKEND_URL}/interview/analytics`, {
    headers: getHeaders(),
  });
  return handleResponse<AnalyticsData>(res);
}

export async function getSessionData(session_id: string): Promise<SessionResponse> {
  const res = await fetch(`${AI_URL}/interview/session/${session_id}`);
  return handleResponse<SessionResponse>(res);
}

// =================== ADMIN ===================
export async function getAdminDashboard(): Promise<AdminDashboard> {
  const res = await fetch(`${BACKEND_URL}/admin/dashboard`, {
    headers: getHeaders(),
  });
  return handleResponse<AdminDashboard>(res);
}

export async function getAdminUsers(): Promise<AdminUsersResponse> {
  const res = await fetch(`${BACKEND_URL}/admin/users`, {
    headers: getHeaders(),
  });
  return handleResponse<AdminUsersResponse>(res);
}