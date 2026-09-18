import { type MessageDescriptor } from 'react-intl';

import { errorReasonToMessages } from './errorMessage';
import { getPrimaryErrorReason } from './getPrimaryErrorReason';
import { getSecondaryErrorReason } from './getSecondaryErrorReason';
import type { MediaViewerError } from './MediaViewerError';

export const getErrorMessageFromError = (
	error: MediaViewerError,
): MessageDescriptor | undefined => {
	const matchingRow = errorReasonToMessages.find(
		(row) => row[0] === getPrimaryErrorReason(error) || row[0] === getSecondaryErrorReason(error),
	);
	return matchingRow ? matchingRow[1] : undefined;
};
