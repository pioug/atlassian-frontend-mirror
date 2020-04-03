import hidePopupMiddleware from '../../hidePopup';
import {
  mockPopupUploadEventEmitter,
  mockStore,
} from '@atlaskit/media-test-helpers';
import { hidePopup, HIDE_POPUP } from '../../../actions/hidePopup';

describe('hidePopupMiddleware', () => {
  const setup = () => ({
    eventEmitter: mockPopupUploadEventEmitter(),
    store: mockStore(),
    next: jest.fn(),
  });

  it(`should emit closed event given ${HIDE_POPUP} action`, () => {
    const { eventEmitter, store, next } = setup();

    hidePopupMiddleware(eventEmitter)(store)(next)(hidePopup());

    expect(eventEmitter.emitClosed).toHaveBeenCalledTimes(1);
  });

  it('should do nothing given other action', () => {
    const { eventEmitter, store, next } = setup();

    hidePopupMiddleware(eventEmitter)(store)(next)({ type: 'OTHER' });

    expect(eventEmitter.emitClosed).not.toBeCalled();
  });
});
