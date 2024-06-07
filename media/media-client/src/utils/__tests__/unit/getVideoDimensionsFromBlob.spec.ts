import { getVideoDimensionsFromBlob } from '../../getVideoDimensionsFromBlob';

describe('getVideoDimensionsFromBlob()', () => {
	const setup = ({ videoWidth, videoHeight } = { videoWidth: 50, videoHeight: 100 }) => {
		const videoFile = new File([''], 'video.mp4');
		const createObjectURL = jest.fn().mockReturnValue('video-url');
		const revokeObjectURL = jest.fn();
		const addEventListener = jest.fn().mockImplementation((eventName, callback) => {
			if (eventName === 'loadedmetadata') {
				callback();
			}
		});
		const removeEventListener = jest.fn();

		const video: Partial<HTMLVideoElement> = {
			addEventListener,
			removeEventListener,
			videoWidth,
			videoHeight,
		};

		const createElement = jest.fn().mockImplementation(() => {
			return video;
		});

		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;
		global.document.createElement = createElement;

		return {
			video,
			videoFile,
			revokeObjectURL,
			addEventListener,
			removeEventListener,
		};
	};

	it('should resolve video dimensions', async () => {
		const { videoFile } = setup({
			videoWidth: 520,
			videoHeight: 1100,
		});

		const dimensions = await getVideoDimensionsFromBlob(videoFile);
		expect(dimensions).toMatchObject({ width: 520, height: 1100 });
	});

	it('gracefully handle error loading video', async () => {
		const { videoFile, addEventListener } = setup();

		addEventListener.mockImplementation((eventName: string, callback: Function) => {
			if (eventName === 'error') {
				callback();
			}
		});

		await expect(getVideoDimensionsFromBlob(videoFile)).rejects.toStrictEqual(
			new Error('failed to load video'),
		);
	});

	it('should clear everything once the get dimension is done', async () => {
		const { videoFile, revokeObjectURL, removeEventListener } = setup();
		await getVideoDimensionsFromBlob(videoFile);

		expect(removeEventListener).toHaveBeenCalledTimes(1);
		expect(revokeObjectURL).toHaveBeenCalledTimes(1);
		expect(revokeObjectURL).toHaveBeenCalledWith('video-url');
	});
});
