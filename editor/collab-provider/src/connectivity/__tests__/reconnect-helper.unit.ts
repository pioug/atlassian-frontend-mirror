import ReconnectHelper from '../reconnect-helper';

describe('Connectivity', () => {
  describe('Reconnect Helper', () => {
    it('should not flag connection issues when initialised', () => {
      const reconnectHelper = new ReconnectHelper();
      expect(reconnectHelper.isLikelyNetworkIssue()).toBe(false);
      reconnectHelper.destroy();
    });

    it('should flag network issues after 8 reconnection issues', () => {
      const reconnectHelper = new ReconnectHelper();
      // Go offline
      window.dispatchEvent(new Event('offline'));
      for (var i = 0; i < 7; i++) {
        reconnectHelper.countReconnectError();
        expect(reconnectHelper.isLikelyNetworkIssue()).toBe(false);
      }
      reconnectHelper.countReconnectError();
      expect(reconnectHelper.isLikelyNetworkIssue()).toBe(true);
      reconnectHelper.destroy();
    });

    it('should not signal a network issue if the browser went back online', () => {
      const reconnectHelper = new ReconnectHelper();
      // Go offline
      window.dispatchEvent(new Event('offline'));
      for (var i = 0; i < 8; i++) {
        reconnectHelper.countReconnectError();
      }
      expect(reconnectHelper.isLikelyNetworkIssue()).toBe(true);
      // Go online
      window.dispatchEvent(new Event('online'));
      expect(reconnectHelper.isLikelyNetworkIssue()).toBe(false);
      reconnectHelper.destroy();
    });
  });
});
