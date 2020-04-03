import { changeAccount } from '../../../actions/changeAccount';
import { changeCloudAccountFolder } from '../../../actions/changeCloudAccountFolder';
import changeAccountMiddleware from '../../changeAccount';

describe('changeAccount', () => {
  const serviceName = 'google';
  const accountId = 'some-account-id';
  const setup = () => {
    return {
      api: {
        dispatch: jest.fn(),
        getState: jest.fn(),
      },
      next: jest.fn(),
    };
  };

  it('should NOT dispatch CHANGE_CLOUD_ACCOUNT_FOLDER given unknown action', () => {
    const { api, next } = setup();

    const unknownAction = { type: 'UNKNOWN_ACTION' };
    changeAccountMiddleware(api)(next)(unknownAction);

    expect(api.dispatch).not.toBeCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(unknownAction);
  });

  it('should NOT dispatch CHANGE_CLOUD_ACCOUNT_FOLDER given serviceName which is NOT "google" or "dropbox"', () => {
    const { api, next } = setup();

    const changeAccountAction = changeAccount('upload', accountId);
    changeAccountMiddleware(api)(next)(changeAccountAction);

    expect(api.dispatch).not.toBeCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(changeAccountAction);
  });

  it('should NOT dispatch CHANGE_CLOUD_ACCOUNT_FOLDER given accountId which is the empty string', () => {
    const { api, next } = setup();

    const changeAccountAction = changeAccount(serviceName, '');
    changeAccountMiddleware(api)(next)(changeAccountAction);

    expect(api.dispatch).not.toBeCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(changeAccountAction);
  });

  it('should dispatch CHANGE_CLOUD_ACCOUNT_FOLDER action given changeAccount action', () => {
    const { api, next } = setup();

    const changeAccountAction = changeAccount(serviceName, accountId);
    changeAccountMiddleware(api)(next)(changeAccountAction);

    expect(api.dispatch).toBeCalledWith(
      changeCloudAccountFolder(serviceName, accountId, []),
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(changeAccountAction);
  });
});
