jest.mock('../../utils', () => ({
	...jest.requireActual('../../utils'),
	downloadUrl: jest.fn(),
}));
import { downloadUrl } from '../../utils';
import { ViewAction } from '../../view/BlockCard/actions/ViewAction';
import { DownloadAction } from '../../view/BlockCard/actions/DownloadAction';

describe('actions', () => {
	describe('ViewAction', () => {
		it('should open link in a new tab', async () => {
			const action = ViewAction({
				url: 'some-url',
			});
			const openSpy = jest.spyOn(window, 'open');
			await action.promise();

			expect(openSpy).toHaveBeenCalledTimes(1);
			expect(openSpy).toHaveBeenCalledWith('some-url', '_blank', 'noopener=yes');
		});
	});

	describe('DownloadAction', () => {
		it('should call downloadUrl with the right arguments ', async () => {
			const action = DownloadAction({
				url: 'some-url',
			});

			await action.promise();
			expect(downloadUrl).toHaveBeenCalledTimes(1);
			expect(downloadUrl).toHaveBeenCalledWith('some-url');
		});
	});
});
