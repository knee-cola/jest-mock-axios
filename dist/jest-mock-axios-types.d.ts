declare type HttpResponse = {
    data: object;
    status?: number;
    statusText?: string;
    headers?: object;
    config?: object;
};
declare type AnyFunction = (...args: any[]) => any;
declare type SpyFn = AnyFunction & {
    mockClear: AnyFunction;
};
export { HttpResponse, AnyFunction, SpyFn };
