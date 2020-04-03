import cancelUploadMiddleware from '../../cancelUpload';
import { cancelUpload } from '../../../actions/cancelUpload';
import {
  expectFunctionToHaveBeenCalledWith,
  mockStore,
} from '@atlaskit/media-test-helpers';

describe('cancelUpload', () => {
  const tenantFileId = 'some-tenant-file-id';

  const setup = (onCancelUpload: () => {}) => ({
    store: mockStore({ onCancelUpload }),
    next: jest.fn(),
    onCancelUpload: jest.fn(),
  });

  it('should call onCancelUpload with given tenantFileId', () => {
    const onCancelUpload = jest.fn();
    const { store, next } = setup(onCancelUpload);

    cancelUploadMiddleware(store)(next)(
      cancelUpload({
        tenantFileId,
      }),
    );

    expect(onCancelUpload).toBeCalledWith(tenantFileId);
    expectFunctionToHaveBeenCalledWith(onCancelUpload, [tenantFileId]);
  });
});
