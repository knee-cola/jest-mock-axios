import axios from "../lib/index";

const UppercaseProxy = (clientMessage) => {
    axios.interceptors.request.use((config) => config);
    axios.interceptors.response.use((config) => config, (err) => Promise.reject(err));

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // requesting data from server
    const axiosPromise = axios.post("/web-service-url/", { data: clientMessage, cancelToken: source.token });

    // converting server response to upper case
    const axiosPromiseConverted = axiosPromise.then((serverData) =>
        serverData.data.toUpperCase(),
    ).catch(() => {
        // tslint:disable-next-line: no-console
        console.log("catched!");
    });

    // returning promise so that client code can attach `then` and `catch` handler
    return axiosPromiseConverted;
};

export default UppercaseProxy;
