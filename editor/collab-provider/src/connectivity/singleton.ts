import Network, { NetworkStatus } from './network';

// Assume the connection is established at first
const network: Network = new Network({ initialStatus: NetworkStatus.ONLINE });

export { network };
