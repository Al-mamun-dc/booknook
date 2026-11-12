import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        return null;
    }

    return data.token;
};