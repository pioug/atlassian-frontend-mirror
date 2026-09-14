jest.mock('@atlaskit/media-ui/getFileInfo');
jest.mock('@atlaskit/media-ui/imageMetaData/getImageInfo');

import { getFileInfo } from '@atlaskit/media-ui/getFileInfo';
import { getImageInfo } from '@atlaskit/media-ui/imageMetaData/getImageInfo';
import { asMock } from '@atlaskit/media-test-helpers';
import { getPreviewFromImage } from '../../getPreviewFromImage';
import { type ImagePreview, type Preview } from '../../../types';

describe('getPreviewFromImage()', () => {
	const file = new File([], 'some-filename');

	beforeEach(() => {
		asMock(getFileInfo).mockResolvedValue('some-file-info');
		asMock(getImageInfo).mockResolvedValue({
			width: 1,
			height: 2,
			scaleFactor: 3,
		});
	});

	it('should get imagepreview from file', async () => {
		const preview = (await getPreviewFromImage(file)) as ImagePreview;
		expect(getImageInfo).toHaveBeenCalledWith('some-file-info');
		expect(preview.dimensions.width).toBe(1);
		expect(preview.dimensions.height).toBe(2);
		expect(preview.scaleFactor).toBe(3);
	});

	it('should not get imagepreview from invalid file', async () => {
		asMock(getImageInfo).mockReturnValue(null);
		const preview = (await getPreviewFromImage(file)) as Preview;
		expect(preview.file).toBe(file);
		expect(preview).not.toHaveProperty('dimensions');
		expect(preview).not.toHaveProperty('scaleFactor');
	});
});
