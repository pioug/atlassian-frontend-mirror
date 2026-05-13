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
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';
import { productAttrIfGateOn } from '@atlaskit/editor-synced-block-provider/utils';

import { SyncedBlockEntityNotFoundError } from './SyncedBlockEntityNotFoundError';
import { SyncedBlockGenericError } from './SyncedBlockGenericError';
import { SyncedBlockLoadError } from './SyncedBlockLoadError';
import { SyncedBlockNotFoundError } from './SyncedBlockNotFoundError';
import { SyncedBlockOfflineError } from './SyncedBlockOfflineError';
import { SyncedBlockPermissionDenied } from './SyncedBlockPermissionDenied';
import { SyncedBlockUnpublishedError } from './SyncedBlockUnpublishedError';

const getForbiddenErrorContent = (
	resourceId?: string,
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	getAccountId?: () => string | null,
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
				accountId={getAccountId?.() ?? null}
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
	getAccountId,
}: {
	error: SyncBlockInstance['error'];
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;
	getAccountId?: () => string | null;
	isLoading?: boolean;
	onRetry?: () => void;
	resourceId?: string;
	sourceURL?: string;
}): React.JSX.Element => {
	useEffect(() => {
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
			case SyncBlockError.EntityNotFound:
				return <SyncedBlockEntityNotFoundError />;
			case SyncBlockError.Offline:
				return <SyncedBlockOfflineError />;
			case SyncBlockError.Forbidden:
				return getForbiddenErrorContent(resourceId, fireAnalyticsEvent, getAccountId);
			case SyncBlockError.NotFound:
				return <SyncedBlockNotFoundError reason={error.reason} sourceAri={error.sourceAri} />;
			case SyncBlockError.Unpublished: {
				return (
					<SyncedBlockUnpublishedError
						sourceURL={sourceURL}
						sourceProduct={productAttrIfGateOn(resourceId)}
					/>
				);
			}
			case SyncBlockError.Errored:
			case SyncBlockError.RateLimited:
			case SyncBlockError.ServerError:
				return <SyncedBlockLoadError onRetry={onRetry} isLoading={isLoading} />;
			default:
				return <SyncedBlockGenericError />;
		}
	}, [error, isLoading, onRetry, resourceId, fireAnalyticsEvent, sourceURL, getAccountId]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div data-testid="sync-block-error" className={SyncBlockSharedCssClassName.error}>
			{getErrorContent}
		</div>
	);
};
