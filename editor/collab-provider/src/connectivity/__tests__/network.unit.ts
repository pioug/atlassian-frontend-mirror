import Network, { NetworkStatus } from '../network';

describe('Connectivity', () => {
	describe('Network', () => {
		describe('Network Status', () => {
			it('should return network status null if no meaningful value', () => {
				const network = new Network();
				expect(network.getStatus()).toBe(null);
				network.destroy();
			});

			it('should initialise the network status to the passed value', () => {
				const networkDefaultOnline = new Network({
					initialStatus: NetworkStatus.ONLINE,
				});
				expect(networkDefaultOnline.getStatus()).toBe('ONLINE');
				networkDefaultOnline.destroy();

				const networkDefaultOffline = new Network({
					initialStatus: NetworkStatus.OFFLINE,
				});
				expect(networkDefaultOffline.getStatus()).toBe('OFFLINE');
				networkDefaultOffline.destroy();
			});

			it('should update the network status when the "online" window event is triggered', () => {
				const network = new Network();
				window.dispatchEvent(new Event('online'));
				expect(network.getStatus()).toBe('ONLINE');
				network.destroy();
			});

			it('should update the network status when the "offline" window event is triggered', () => {
				const network = new Network();
				window.dispatchEvent(new Event('offline'));
				expect(network.getStatus()).toBe('OFFLINE');
				network.destroy();
			});
		});

		describe('onlineCallback', () => {
			it('Should register the onlineCallback and call it when online event is triggered', () => {
				const mockFn = jest.fn();
				const network = new Network({ onlineCallback: mockFn });
				expect(network.onlineCallback).toEqual(mockFn);
				expect(network.onlineCallback).not.toHaveBeenCalled();
				window.dispatchEvent(new Event('online'));
				expect(network.onlineCallback).toHaveBeenCalledTimes(1);
				expect(network.onlineCallback).toHaveBeenCalledWith();
			});

			it('Does not call the onlineCallback when the offline event is triggered', () => {
				const mockFn = jest.fn();
				const network = new Network({ onlineCallback: mockFn });
				expect(network.onlineCallback).toEqual(mockFn);
				expect(network.onlineCallback).not.toHaveBeenCalled();
				window.dispatchEvent(new Event('offline'));
				expect(network.onlineCallback).not.toHaveBeenCalled();
			});
		});
	});
});
