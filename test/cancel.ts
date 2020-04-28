import axios from "../lib/index";

export const getData = (shouldCancel: boolean) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const promise = axios.get('/user/12345', {
        cancelToken: source.token
    });

    if (shouldCancel) {
        source.cancel('Operation canceled by the user.')
    }

    return promise;
}
