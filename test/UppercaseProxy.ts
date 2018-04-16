import axios from '../lib/index';

const UppercaseProxy = (clientMessage) => {

    // requesting data from server
    let axiosPromise = axios.post('/web-service-url/', { data: clientMessage });

    // converting server response to upper case
    axiosPromise = axiosPromise.then(serverData => serverData.data.toUpperCase());

    // returning promise so that client code can attach `then` and `catch` handler
    return(axiosPromise);
};

export default UppercaseProxy;