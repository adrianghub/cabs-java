import type { z } from "zod";

const BASE_URL = "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    const msg =
      typeof body === "object" && body !== null && "error" in body
        ? (body as { error: string }).error
        : `API error ${status}`;
    super(msg);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: string,
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => response.text())
      .catch(() => "Unknown error");
    throw new ApiError(response.status, errorBody);
  }

  const json = await response.json();
  return schema.parse(json);
}

async function requestVoid(
  method: string,
  path: string,
  body?: unknown,
): Promise<void> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => response.text())
      .catch(() => "Unknown error");
    throw new ApiError(response.status, errorBody);
  }
}

async function requestRaw<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => response.text())
      .catch(() => "Unknown error");
    throw new ApiError(response.status, errorBody);
  }

  return response.json() as Promise<T>;
}

export function get<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  return request("GET", path, schema);
}

export function post<T>(
  path: string,
  body: unknown | undefined,
  schema: z.ZodType<T>,
): Promise<T> {
  return request("POST", path, schema, body);
}

export function postVoid(path: string, body?: unknown): Promise<void> {
  return requestVoid("POST", path, body);
}

export function del(path: string): Promise<void> {
  return requestVoid("DELETE", path);
}

export function getRaw<T>(path: string): Promise<T> {
  return requestRaw<T>("GET", path);
}
