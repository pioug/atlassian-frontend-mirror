import {
  getRecentFilesStarted,
  getRecentFilesFullfilled,
  getRecentFilesFailed,
} from '../../getFilesInRecents';
import { State } from '../../../domain';
import { GetFilesInRecentsAction } from '../../../actions/getFilesInRecents';

describe('getFilesInRecents', () => {
  it('should preserve existing items', () => {
    const state = {
      recents: {
        items: [1],
      },
    } as any;
    const action: GetFilesInRecentsAction = {
      type: 'GET_FILES_IN_RECENTS',
    };
    const { recents, view } = getRecentFilesStarted(state, action);

    expect(recents).toEqual({
      items: [1],
    });
    expect(view).toEqual(
      expect.objectContaining({
        service: {
          name: 'upload',
          accountId: '',
        },
        path: [],
        hasError: false,
      }),
    );
  });

  it('should contain recent items when request fullfilled', () => {
    const state = {} as State;
    const action = {
      type: 'GET_FILES_IN_RECENTS_FULLFILLED',
      items: [1, 2],
    };
    const { recents, view } = getRecentFilesFullfilled(state, action);

    expect(recents).toEqual({
      items: [1, 2],
    });
    expect(view).toEqual(
      expect.objectContaining({
        isLoading: false,
      }),
    );
  });

  it('should mark state as error when request failed', () => {
    const state = {} as State;
    const action = {
      type: 'GET_FILES_IN_RECENTS_FAILED',
    };
    const { recents, view } = getRecentFilesFailed(state, action);

    expect(recents).toEqual(undefined);
    expect(view).toEqual(
      expect.objectContaining({
        isLoading: false,
        hasError: true,
      }),
    );
  });
});
