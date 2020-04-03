import { UploadController } from '../..';

describe('UploadController', () => {
  it('should call cancel function when is setted', () => {
    const controller = new UploadController();
    const cancel = jest.fn();

    controller.setAbort(cancel);
    expect(cancel).not.toBeCalled();
    controller.abort();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
