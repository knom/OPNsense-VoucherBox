import { setGlobalDispatcher, Agent } from "undici";

export class OpnsenseApi {
    private baseUrl: string;
    private headers: Record<string, string>;

    constructor({ baseUrl, username, password, allowSelfSigned = false }: { baseUrl: string; username: string; password: string; allowSelfSigned?: boolean }) {
        this.baseUrl = baseUrl;
        const encoded = Buffer.from(`${username}:${password}`).toString('base64');
        this.headers = {
            'Authorization': `Basic ${encoded}`,
        };

        if (!allowSelfSigned) return;
 
        setGlobalDispatcher(
            new Agent({
                connect: {
                    rejectUnauthorized: false, // disables certificate verification
                },
            })
        );
    }

    async get(relativeUrl: string, extraHeaders?: Record<string, string>) {
        const url = `${this.baseUrl}${relativeUrl}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { ...this.headers, ...extraHeaders },

        });
        return response;
    }

    async post(relativeUrl: string, body?: unknown, extraHeaders?: Record<string, string>) {
        const url = `${this.baseUrl}${relativeUrl}`;
        const headers = { 'Content-Type': 'application/json', ...this.headers, ...extraHeaders };
        const options: RequestInit = {
            method: 'POST',
            headers,
            body: body ? JSON.stringify(body) : undefined
        };
        const response = await fetch(url, options);
        return response;
    }
}
