import { renderSmartLinkHook } from '../../../utils/test-utils';
import { useSmartCardState } from '..';
import { CardStore } from '../../types';
// TODO: Those tests are wrong and are not entering into the renderHook callbacks.
// https://product-fabric.atlassian.net/browse/SL-366
describe.skip('useSmartCardState()', () => {
  let mockUrl = 'some.url';

  it('correctly returns default state', () => {
    renderSmartLinkHook(() => {
      const result = useSmartCardState(mockUrl);
      expect(result).toEqual({
        status: 'pending',
        lastUpdatedAt: expect.anything(),
      });
    });
  });

  it('correctly returns default state, store on context undefined', () => {
    const initialState: CardStore = {};
    renderSmartLinkHook(
      () => {
        const result = useSmartCardState(mockUrl);
        expect(result).toEqual(initialState['some.url']);
      },
      { storeOptions: { initialState } },
    );
  });

  it('correctly returns state from context', () => {
    const initialState: CardStore = {
      'some.url': {
        status: 'resolved',
        lastUpdatedAt: Date.now(),
        details: {
          meta: {
            auth: [],
            visibility: 'restricted',
            access: 'granted',
            definitionId: 'd1',
          },
        },
      },
    };
    renderSmartLinkHook(
      () => {
        const result = useSmartCardState(mockUrl);
        expect(result).toEqual(initialState['some.url']);
      },
      { storeOptions: { initialState } },
    );
  });
});
