import React, { useMemo } from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { getPageIdAndTypeFromAri, SyncBlockError } from '@atlaskit/editor-synced-block-provider';

import { SyncedBlockGenericError } from './SyncedBlockGenericError';
import { SyncedBlockLoadError } from './SyncedBlockLoadError';
import { SyncedBlockPermissionDenied } from './SyncedBlockPermissionDenied';

export const SyncedBlockErrorComponent = ({
	error,
	isLoading,
	onRetry,
	resourceId,
	documentAri,
}: {
	documentAri?: string;
	error: SyncBlockError;
	isLoading?: boolean;
	onRetry?: () => void;
	resourceId?: string;
}) => {
	const getErrorContent = useMemo(() => {
		switch (error) {
			case SyncBlockError.Forbidden:
				if (!resourceId) {
					return <SyncedBlockGenericError />;
				}
				if (documentAri) {
					const { id: contentId } = getPageIdAndTypeFromAri(documentAri);
					if (contentId) {
						return <SyncedBlockPermissionDenied contentId={contentId} />;
					}
				}
				const { id: contentId } = getPageIdAndTypeFromAri(resourceId);
				if (contentId) {
					return <SyncedBlockPermissionDenied contentId={contentId} />;
				}
				return <SyncedBlockGenericError />;
			case SyncBlockError.NotFound:
			case SyncBlockError.Errored:
				return <SyncedBlockLoadError onRetry={onRetry} isLoading={isLoading} />;
			default:
				return <SyncedBlockGenericError />;
		}
	}, [documentAri, error, isLoading, onRetry, resourceId]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div className={SyncBlockSharedCssClassName.error}>{getErrorContent}</div>
	);
};
