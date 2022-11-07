import { takeSnapshot } from '../../videoSnapshot';

describe('takeSnapshot()', () => {
  const setup = (
    { videoWidth, videoHeight } = { videoWidth: 50, videoHeight: 100 },
  ) => {
    const videoFile = new File([''], 'video.mp4');
    const createObjectURL = jest.fn().mockReturnValue('video-url');
    const revokeObjectURL = jest.fn();
    const addEventListener = jest
      .fn()
      .mockImplementation((eventName: string, callback: Function) => {
        if (eventName === 'timeupdate') {
          callback();
        }
      });
    const removeEventListener = jest.fn();
    const drawImage = jest.fn();
    const getContext = jest.fn().mockImplementation(() => {
      return {
        drawImage,
      };
    });
    const pause = jest.fn();
    const play = jest.fn().mockImplementation(() => {
      return {
        catch: jest.fn(),
      };
    });
    const video: Partial<HTMLVideoElement> = {
      addEventListener,
      removeEventListener,
      play,
      pause,
      videoWidth,
      videoHeight,
      duration: 100,
    };

    const createElement = jest.fn().mockImplementation((type: string) => {
      if (type === 'video') {
        return video;
      } else if (type === 'canvas') {
        return {
          getContext,
          toDataURL: jest.fn().mockReturnValue('data-img'),
        };
      }

      return;
    });

    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    global.document.createElement = createElement;

    return {
      video,
      videoFile,
      play,
      pause,
      drawImage,
      revokeObjectURL,
      removeEventListener,
      addEventListener,
      getContext,
    };
  };

  it('should return a snapshot image from the video file', async () => {
    const { videoFile, video, drawImage, revokeObjectURL } = setup();
    const snapshot = await takeSnapshot(videoFile);

    expect(drawImage).toBeCalledWith(video, 0, 0, 50, 100);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(video.src).toEqual('video-url');
    expect(snapshot).toEqual('data-img');
  });

  it('gracefully handle error loading video', async () => {
    const { videoFile, addEventListener } = setup();

    addEventListener.mockImplementation(
      (eventName: string, callback: Function) => {
        if (eventName === 'error') {
          callback();
        }
      },
    );

    await expect(takeSnapshot(videoFile)).rejects.toStrictEqual(
      new Error('failed to load video'),
    );
  });

  it('gracefully handle error playing video', async () => {
    const { videoFile, video, addEventListener } = setup();

    addEventListener.mockRestore();

    video.play = jest.fn().mockRejectedValue('any error');

    await expect(takeSnapshot(videoFile)).rejects.toStrictEqual(
      new Error('failed to play video'),
    );
  });

  it('gracefully handle error while if video diminensions are not available', async () => {
    const { videoFile } = setup({
      videoWidth: 0,
      videoHeight: 0,
    });

    await expect(takeSnapshot(videoFile)).rejects.toStrictEqual(
      new Error('error retrieving video dimensions'),
    );
  });

  it('gracefully handle error while if the canvas is not supported', async () => {
    const { videoFile, getContext } = setup();

    getContext.mockReturnValue(null);

    await expect(takeSnapshot(videoFile)).rejects.toStrictEqual(
      new Error('error creating canvas context'),
    );
  });

  it('should clear everything once the snapshot is done', async () => {
    const { videoFile, removeEventListener, pause, revokeObjectURL } = setup();
    await takeSnapshot(videoFile);

    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('video-url');
  });
});
