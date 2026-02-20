import React, { useMemo, useEffect } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import {
	fetchErrorPayload,
	getContentIdAndProductFromResourceId,
	SyncBlockError,
	type SyncBlockInstance,
} from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { SyncedBlockGenericError } from './SyncedBlockGenericError';
import { SyncedBlockLoadError } from './SyncedBlockLoadError';
import { SyncedBlockNotFoundError } from './SyncedBlockNotFoundError';
import { SyncedBlockOfflineError } from './SyncedBlockOfflineError';
import { SyncedBlockPermissionDenied } from './SyncedBlockPermissionDenied';
import { SyncedBlockUnpublishedError } from './SyncedBlockUnpublishedError';

const getForbiddenErrorContent = (
	resourceId?: string,
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
) => {
	try {
		if (!resourceId) {
			throw new Error('Missing resource id');
		}

		const { sourceContentId, sourceProduct } = getContentIdAndProductFromResourceId(resourceId);
		return (
			<SyncedBlockPermissionDenied
				sourceContentId={sourceContentId}
				sourceProduct={sourceProduct}
			/>
		);
	} catch (error) {
		logException(error as Error, {
			location: 'editor-synced-block-renderer/SyncedBlockErrorComponent',
		});
		fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));
		return <SyncedBlockGenericError />;
	}
};

export const SyncedBlockErrorComponent = ({
	error,
	isLoading,
	onRetry,
	resourceId,
	fireAnalyticsEvent,
	sourceURL,
}: {
	error: SyncBlockInstance['error'];
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;
	isLoading?: boolean;
	onRetry?: () => void;
	resourceId?: string;
	sourceURL?: string;
}): React.JSX.Element => {
	useEffect(() => {
		if (!fg('platform_synced_block_patch_3')) {
			return;
		}

		fireAnalyticsEvent?.({
			action: ACTION.ERROR,
			actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
			attributes: {
				error: `${error?.reason || error?.type}: error component rendered`,
				resourceId: resourceId,
			},
			eventType: EVENT_TYPE.OPERATIONAL,
		});
	}, [error?.reason, error?.type, resourceId, fireAnalyticsEvent]);

	const getErrorContent = useMemo(() => {
		switch (error?.type) {
			case SyncBlockError.Offline:
				return <SyncedBlockOfflineError />;
			case SyncBlockError.Forbidden:
				return getForbiddenErrorContent(resourceId, fireAnalyticsEvent);
			case SyncBlockError.NotFound:
				return <SyncedBlockNotFoundError reason={error.reason} sourceAri={error.sourceAri} />;
			case SyncBlockError.Unpublished:
				return <SyncedBlockUnpublishedError sourceURL={sourceURL} />;
			case SyncBlockError.Errored:
			case SyncBlockError.RateLimited:
			case SyncBlockError.ServerError:
				return <SyncedBlockLoadError onRetry={onRetry} isLoading={isLoading} />;
			default:
				return <SyncedBlockGenericError />;
		}
	}, [error, isLoading, onRetry, resourceId, fireAnalyticsEvent, sourceURL]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div data-testid="sync-block-error" className={SyncBlockSharedCssClassName.error}>
			{getErrorContent}
		</div>
	);
};
