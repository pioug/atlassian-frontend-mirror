import React, { useMemo, useEffect } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import {
	fetchErrorPayload,
	getContentIdAndProductFromResourceId,
	SyncBlockError,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';
import { buildFetchErrorAttribution } from '@atlaskit/editor-synced-block-provider/errorHandling';
import { getSourceProductFromResourceIdSafe } from '@atlaskit/editor-synced-block-provider/utils';
import { fg } from '@atlaskit/platform-feature-flags';

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
		// Emit structured attribution via the shared builder instead of an opaque
		// `errored`-only blob. Prefer the PII-safe `originalMessage` so the classifier
		// can bucket the real cause; fall back to `reason` then the bare `type`.
		// Gate-off is a no-op (builder returns undefined → no new attributes).
		const gateEnabled = fg('platform_editor_blocks_patch_4');
		const rawError = error?.originalMessage || error?.reason || error?.type || 'unknown';

		fireAnalyticsEvent?.(
			fetchErrorPayload(
				`${rawError}: error component rendered`,
				resourceId,
				getSourceProductFromResourceIdSafe(resourceId),
				buildFetchErrorAttribution(gateEnabled, rawError, error?.statusCode),
			),
		);
	}, [
		error?.originalMessage,
		error?.reason,
		error?.type,
		error?.statusCode,
		resourceId,
		fireAnalyticsEvent,
	]);

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
						sourceProduct={getSourceProductFromResourceIdSafe(resourceId)}
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
