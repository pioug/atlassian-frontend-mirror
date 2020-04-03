import { changeService as changeServiceActionCreator } from '../../../actions';
import { changeService } from '../../changeService';
import { mockStore } from '@atlaskit/media-test-helpers';
import { ServiceAccountWithType } from '../../../../popup/domain';

describe('changeService()', () => {
  it('should NOT dispatch CHANGE_ACCOUNT given unknown action', () => {
    const store = mockStore();
    const next = jest.fn();

    const unknownAction = { type: 'UNKNOWN_ACTION' };
    changeService(store)(next)(unknownAction);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(unknownAction);
  });

  it('should dispatch CHANGE_ACCOUNT given CHANGE_ACCOUNT action', async () => {
    const store = mockStore();
    const next = jest.fn();

    const serviceName = 'google';
    const changeServiceAction = changeServiceActionCreator(serviceName);
    await changeService(store)(next)(changeServiceAction);

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(changeServiceAction);
  });

  it('should dispatch CHANGE_ACCOUNT action with an existing account id if it is defined and the current accountId is empty', async () => {
    const next = jest.fn();
    const stubAccounts: Promise<ServiceAccountWithType[]> = Promise.resolve([
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ] as ServiceAccountWithType[]);

    const store = mockStore({
      accounts: stubAccounts,
      view: {
        isVisible: true,
        items: [],
        isLoading: false,
        hasError: false,
        path: [],
        service: {
          accountId: '',
          name: 'upload',
        },
        isUploading: false,
        isCancelling: false,
      },
    });
    const serviceName = 'dropbox';
    const unknownAction = changeServiceActionCreator(serviceName);
    await changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(2);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName,
      accountId: '2',
    });
  });

  it('should dispatch CHANGE_ACCOUNT action with first account id if accounts for the given service are in state', async () => {
    const next = jest.fn();
    const stubAccounts: Promise<ServiceAccountWithType[]> = Promise.resolve([
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ] as ServiceAccountWithType[]);

    const store = mockStore({
      accounts: stubAccounts,
      view: {
        isVisible: true,
        items: [],
        isLoading: false,
        hasError: false,
        path: [],
        service: {
          accountId: 'some-id',
          name: 'upload',
        },
        isUploading: false,
        isCancelling: false,
      },
    });
    const serviceName = 'dropbox';
    const unknownAction = changeServiceActionCreator(serviceName);
    await changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(2);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName,
      accountId: 'some-id',
    });
  });

  it('should dispatch CHANGE_ACCOUNT action with accountId as empty string if there are NO accounts for the given service are in state', async () => {
    const next = jest.fn();
    const stubAccounts: Promise<ServiceAccountWithType[]> = Promise.resolve([
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ] as ServiceAccountWithType[]);

    const store = mockStore({
      accounts: stubAccounts,
      view: {
        isVisible: true,
        items: [],
        isLoading: false,
        hasError: false,
        path: [],
        service: {
          accountId: '',
          name: 'upload',
        },
        isUploading: false,
        isCancelling: false,
      },
    });

    const serviceName = 'upload';
    const unknownAction = changeServiceActionCreator(serviceName);
    await changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName: 'upload',
      accountId: '',
    });
  });

  it('should dispatch CHANGE_ACCOUNT action with accountId as first account id when there are NO accounts for the given service are in state', async () => {
    const next = jest.fn();
    const stubAccounts: Promise<ServiceAccountWithType[]> = Promise.resolve([
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ] as ServiceAccountWithType[]);

    const store = mockStore({
      accounts: stubAccounts,
      view: {
        isVisible: true,
        items: [],
        isLoading: false,
        hasError: false,
        path: [],
        service: {
          accountId: 'some-id',
          name: 'upload',
        },
        isUploading: false,
        isCancelling: false,
      },
    });

    const serviceName = 'upload';
    const unknownAction = changeServiceActionCreator(serviceName);
    await changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName: 'upload',
      accountId: 'some-id',
    });
  });
});
