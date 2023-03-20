import Network, { NetworkStatus } from './network';

// Assume the connection is established at first
const network = new Network({ initialStatus: NetworkStatus.ONLINE });

export { network };
