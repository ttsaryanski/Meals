async function requester<T>(
    method: string,
    url: string,
    data?: unknown,
): Promise<T> {
    const option: RequestInit = {
        method,
        credentials: "include" as RequestCredentials,
        headers: {} as Record<string, string>,
    };

    if (data != undefined) {
        if (data instanceof FormData) {
            option.body = data;
        } else {
            (option.headers as Record<string, string>)["Content-Type"] =
                "application/json";
            option.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(url, option);
        if (!response.ok) {
            const error = await response.json();

            throw new Error(error.message || "Something went wrong!");
        }

        return response.json() as Promise<T>;
    } catch (error) {
        throw error;
    }
}

async function get<T>(url: string): Promise<T> {
    return requester<T>("GET", url);
}

async function post<T>(url: string, data?: unknown): Promise<T> {
    return requester<T>("POST", url, data);
}

export const api = {
    get,
    post,
};
