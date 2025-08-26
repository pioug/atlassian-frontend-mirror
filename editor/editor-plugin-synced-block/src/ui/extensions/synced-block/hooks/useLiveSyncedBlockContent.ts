import { useMemo } from 'react';

import { usePollContentProperty } from '../hooks/usePollContentProperty';
import { parseSyncedBlockContentPropertyValue } from '../utils/synced-block';

type UseLiveSyncedBlockContentOptions = {
	contentAri: string;
	sourceDocumentAri: string;
};

export const useLiveSyncedBlockContent = ({
	sourceDocumentAri,
	contentAri,
}: UseLiveSyncedBlockContentOptions) => {
	const contentProperty = usePollContentProperty({
		sourceDocumentAri,
		contentAri,
	});

	return useMemo(() => {
		if (!contentProperty) {
			return null;
		}

		try {
			return parseSyncedBlockContentPropertyValue(contentProperty.value);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Failed to extract synced block content:', error);
			return null;
		}
	}, [contentProperty]);
};
