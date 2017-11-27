
type HttpResponse = {
    data:object,
    status?:number,
    statusText?:string,
    headers?:object,
    config?:object,
}

type AnyFunction = (...args:any[]) => any;

// spy is a function which extends an object (it has static methods and properties)
type SpyFn = AnyFunction & { mockClear:AnyFunction };
  
export {HttpResponse, AnyFunction, SpyFn}