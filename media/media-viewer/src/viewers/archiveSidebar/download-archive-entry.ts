import { type ZipEntry } from 'unzipit';

import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import { downloadUrl } from '@atlaskit/media-common/downloadUrl';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { rejectAfter } from '../../utils/rejectAfter';

// Downloads one entry of a zip file under the given name.
export const downloadArchiveEntry = async (
	entry: ZipEntry,
	name: string,
	fileId?: string,
): Promise<void> => {
	const blob = await rejectAfter<Blob>(() => entry.blob());

	// Emit media-viewed event if feature flag is enabled
	if (fileId && fg('download_event_for_jira_attachments')) {
		globalMediaEventEmitter.emit('media-viewed', {
			fileId,
			viewingLevel: 'download',
			childFileName: name,
		});
	}

	downloadUrl(URL.createObjectURL(blob), { name });
};
