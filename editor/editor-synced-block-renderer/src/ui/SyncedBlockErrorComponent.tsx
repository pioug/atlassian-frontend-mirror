import React, { useMemo } from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { SyncBlockError } from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockProduct } from '@atlaskit/editor-synced-block-provider';

import { SyncedBlockGenericError } from './SyncedBlockGenericError';
import { SyncedBlockLoadError } from './SyncedBlockLoadError';
import { SyncedBlockOfflineError } from './SyncedBlockOfflineError';
import { SyncedBlockPermissionDenied } from './SyncedBlockPermissionDenied';

export const SyncedBlockErrorComponent = ({
	error,
	isLoading,
	onRetry,
	sourceAri,
	sourceProduct,
}: {
	error: SyncBlockError;
	isLoading?: boolean;
	onRetry?: () => void;
	sourceAri?: string;
	sourceProduct?: SyncBlockProduct;
}): React.JSX.Element => {
	const getErrorContent = useMemo(() => {
		switch (error) {
			case SyncBlockError.Offline:
				return <SyncedBlockOfflineError />
			case SyncBlockError.Forbidden:
				if (!sourceAri || !sourceProduct) {
					return <SyncedBlockGenericError />;
				}
				return <SyncedBlockPermissionDenied sourceAri={sourceAri} sourceProduct={sourceProduct} />;
			case SyncBlockError.NotFound:
			case SyncBlockError.Errored:
			case SyncBlockError.RateLimited:
			case SyncBlockError.ServerError:
				return <SyncedBlockLoadError onRetry={onRetry} isLoading={isLoading} />;
			default:
				return <SyncedBlockGenericError />;
		}
	}, [error, isLoading, onRetry, sourceAri, sourceProduct]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div className={SyncBlockSharedCssClassName.error}>{getErrorContent}</div>
	);
};
