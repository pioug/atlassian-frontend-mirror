import fileListUpdate from '../../fileListUpdate';
import { FILE_LIST_UPDATE } from '../../../actions';
import { State, View } from '../../../domain';

describe('fileListUpdate() reducer', () => {
  const currentPath = [{ id: 'folder1' }, { id: 'folder2' }];
  const accountId = 'account1';

  const state: State = {
    view: {
      path: currentPath,
      isLoading: true,
      service: {
        accountId,
      },
    } as View,
  } as State;

  it('adding items to state for current folder', () => {
    const items = ['item1', 'item2'];

    const action: any = {
      type: FILE_LIST_UPDATE,
      path: currentPath,
      accountId,
      items,
    };

    const newState = fileListUpdate(state, action);
    expect(newState.view.items).toEqual(items);
    expect(newState.view.isLoading).toBeFalsy();
  });

  it('does nothing if results came for the wrong folder', () => {
    const items = ['item1', 'item2'];

    const action: any = {
      type: FILE_LIST_UPDATE,
      path: [{ id: 'folder1' }],
      accountId,
      items,
    };

    const newState = fileListUpdate(state, action);
    expect(newState.view.items).toBeUndefined();
    expect(newState.view.isLoading).toBeTruthy();
  });

  it('does nothing if results came for the wrong accountId', () => {
    const items = ['item1', 'item2'];

    const action: any = {
      type: FILE_LIST_UPDATE,
      path: currentPath,
      accountId: 'wrongAcc',
      items,
    };

    const newState = fileListUpdate(state, action);

    expect(newState.view.items).toBeUndefined();
    expect(newState.view.isLoading).toBeTruthy();
  });

  it('does nothing if action have different type', () => {
    const items = ['item1', 'item2'];

    const action: any = {
      type: 'FILE_LIST_UPDATE_REQUEST',
      path: currentPath,
      accountId,
      data: {
        items,
      },
    };

    const newState = fileListUpdate(state, action);
    expect(newState.view.items).toBeUndefined();
    expect(newState.view.isLoading).toBeTruthy();
  });
});
