import type { MediaAttributes } from '@atlaskit/adf-schema';

export const hasPrivateAttrsChanged = (
	currentAttrs: MediaAttributes,
	newAttrs: Partial<MediaAttributes>,
): boolean => {
	return (
		currentAttrs.__fileName !== newAttrs.__fileName ||
		currentAttrs.__fileMimeType !== newAttrs.__fileMimeType ||
		currentAttrs.__fileSize !== newAttrs.__fileSize ||
		currentAttrs.__contextId !== newAttrs.__contextId ||
		// A changed id means the media source was replaced — always re-initialise
		// the updater so getRemoteDimensions fetches dimensions for the new file.
		// Only check when id is explicitly present on the new attrs (it's Partial).
		('id' in newAttrs && currentAttrs.id !== newAttrs.id)
	);
};
