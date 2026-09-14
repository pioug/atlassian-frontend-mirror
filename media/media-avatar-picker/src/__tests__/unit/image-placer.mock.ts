/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { mockCanvas } from '@atlaskit/media-test-helpers/mockCanvas';
import { loadImageMockSetup } from '@atlaskit/media-test-helpers/mockLoadImage';

jest.mock('../../util', () => {
	return {
		...jest.requireActual<object>('../../util'),
		getCanvas: jest.fn().mockReturnValue(mockCanvasMock),
	};
});

const mockCanvasMock = mockCanvas();

loadImageMockSetup(); // Register the image utility subpath mocks before importing the component.

export const mockImage = {
	naturalWidth: 1,
	naturalHeight: 2,
} as HTMLImageElement;
export const translate = mockCanvasMock.context.translate! as jest.Mock;
export const scale = mockCanvasMock.context.scale! as jest.Mock;
export const rotate = mockCanvasMock.context.rotate! as jest.Mock;
export const drawImage = mockCanvasMock.context.drawImage! as jest.Mock;
export const clip = mockCanvasMock.context.clip! as jest.Mock;
export const toDataURL = mockCanvasMock.canvas.toDataURL! as jest.Mock;
toDataURL.mockReturnValue('some-data-url');
