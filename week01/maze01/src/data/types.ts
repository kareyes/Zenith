

export type ResponseStatus = "success" | "error";

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse &{
    status: ResponseStatus;
    data?: T;
}

export type SuccessResponse<T> = {
    data: T
}

export type ErrorResponse = {   
    error: string;
}

