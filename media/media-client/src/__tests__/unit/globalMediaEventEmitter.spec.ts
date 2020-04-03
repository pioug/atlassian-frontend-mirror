import { FileState, globalMediaEventEmitter } from '../../';

describe('globalMediaEventEmitter', () => {
  const fileState: FileState = {
    status: 'uploading',
    id: '1',
    mediaType: 'image',
    mimeType: '',
    name: 'some-file',
    progress: 1,
    size: 1,
  };

  it('should call event listener when an event is emitted', () => {
    const onFileUploaded = jest.fn();

    globalMediaEventEmitter.emit('file-added', fileState);
    globalMediaEventEmitter.on('file-added', onFileUploaded);
    globalMediaEventEmitter.emit('file-added', fileState);

    expect(onFileUploaded).toBeCalledTimes(1);
    expect(onFileUploaded).toBeCalledWith(fileState);
  });

  it('should not call event listener if we unsubscribe', () => {
    const onFileUploaded = jest.fn();

    globalMediaEventEmitter.on('file-added', onFileUploaded);
    globalMediaEventEmitter.emit('file-added', fileState);
    globalMediaEventEmitter.off('file-added', onFileUploaded);
    globalMediaEventEmitter.emit('file-added', fileState);

    expect(onFileUploaded).toBeCalledTimes(1);
  });
});
