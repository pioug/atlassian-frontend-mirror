import { isRealErrorFromService } from '../../../reaction-store/utils';

describe('isRealErrorFromService', () => {
  it('should return true for a real error', async () => {
    const errorCode = 500;
    const result = isRealErrorFromService(errorCode);
    expect(result).toBeTruthy();
  });

  it('should return true when error code is undefined', async () => {
    const errorCode = undefined;
    const result = isRealErrorFromService(errorCode);
    expect(result).toBeTruthy();
  });

  it('should return false for 401 or 403 error', async () => {
    let errorCode = 401;

    let result = isRealErrorFromService(errorCode);
    expect(result).toBeFalsy();

    errorCode = 403;
    result = isRealErrorFromService(errorCode);
    expect(result).toBeFalsy();
  });
});
