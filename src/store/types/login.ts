export interface TokenData {
    AccessToken: string;
    RefreshToken: string;
    TokenType: string;
    ExpiresAt: string;
    email?: string;
}

export interface LoginResponse {
    ApiStatus: boolean;
    ApiStatusCode: number;
    ApiStatusMessage: string;
    Data: TokenData;
    email?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
} 