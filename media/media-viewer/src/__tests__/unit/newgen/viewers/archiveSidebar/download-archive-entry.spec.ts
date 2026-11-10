import { type ZipEntry } from 'unzipit';

import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import * as MediaCommon from '@atlaskit/media-common/downloadUrl';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { downloadArchiveEntry } from '../../../../../viewers/archiveSidebar/download-archive-entry';

describe('downloadArchiveEntry', () => {
	const blob = new Blob(['content']);
	const createEntry = (blobImpl: () => Promise<Blob> = () => Promise.resolve(blob)) =>
		({ blob: jest.fn(blobImpl) }) as unknown as ZipEntry;

	let downloadUrlSpy: jest.SpyInstance;
	let emitSpy: jest.SpyInstance;

	beforeEach(() => {
		downloadUrlSpy = jest.spyOn(MediaCommon, 'downloadUrl').mockImplementation(() => {});
		emitSpy = jest.spyOn(globalMediaEventEmitter, 'emit').mockImplementation(() => {});
		URL.createObjectURL = jest.fn().mockReturnValue('blob:entry-url');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should download the entry blob under the given name and emit media-viewed when a file id is given', async () => {
		passGate('download_event_for_jira_attachments');

		await downloadArchiveEntry(createEntry(), 'entry1.jpg', 'file-id');

		expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
		expect(downloadUrlSpy).toHaveBeenCalledWith('blob:entry-url', { name: 'entry1.jpg' });
		expect(emitSpy).toHaveBeenCalledTimes(1);
		expect(emitSpy).toHaveBeenCalledWith('media-viewed', {
			fileId: 'file-id',
			viewingLevel: 'download',
			childFileName: 'entry1.jpg',
		});
	});

	// Without a file id the gate isn't read, so it isn't set here.
	it('should download without emitting media-viewed when there is no file id', async () => {
		await downloadArchiveEntry(createEntry(), 'entry1.jpg');

		expect(downloadUrlSpy).toHaveBeenCalledWith('blob:entry-url', { name: 'entry1.jpg' });
		expect(emitSpy).not.toHaveBeenCalled();
	});

	it('should download without emitting media-viewed when the gate is off', async () => {
		failGate('download_event_for_jira_attachments');

		await downloadArchiveEntry(createEntry(), 'entry1.jpg', 'file-id');

		expect(downloadUrlSpy).toHaveBeenCalledWith('blob:entry-url', { name: 'entry1.jpg' });
		expect(emitSpy).not.toHaveBeenCalled();
	});

	// The read fails before the gate is checked, so it isn't set here.
	it('should reject without downloading when the entry blob rejects', async () => {
		const error = new Error('blob failed');

		await expect(
			downloadArchiveEntry(
				createEntry(() => Promise.reject(error)),
				'entry1.jpg',
				'file-id',
			),
		).rejects.toBe(error);

		expect(downloadUrlSpy).not.toHaveBeenCalled();
		expect(emitSpy).not.toHaveBeenCalled();
	});
});
