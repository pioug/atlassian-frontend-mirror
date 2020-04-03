import { renderHook, renderSmartLinkHook } from '../../../utils/test-utils';
import { useSmartLinkContext } from '..';
import CardClient from '../../../client';
// TODO: Those tests are wrong and are not entering into the renderHook callbacks.
// https://product-fabric.atlassian.net/browse/SL-366
describe.skip('useSmartCardContext()', () => {
  it('throws if required context not present', () => {
    renderHook(() => {
      const result = useSmartLinkContext();
      expect(result).toBe(
        new Error('useSmartCard() must be wrapped in <SmartCardProvider>'),
      );
    });
  });

  it('provides correct context to consumers', () => {
    renderSmartLinkHook(() => {
      const result = useSmartLinkContext();
      expect(result).toEqual(
        expect.objectContaining({
          config: { maxAge: 15000, maxLoading: 1200 },
          connections: {
            client: new CardClient(),
          },
          state: {},
          dispatch: expect.anything(),
        }),
      );
    });
  });
});
