/** @deprecated Use @atlaskit/linking-common/types */
export type {
	InvokePayload,
	InvocationContext,
	InvocationSearchPayload,
	CardAppearance,
	CardType,
	CardActionType,
	CardAction,
	ServerActionOpts,
	ServerActionPayload,
	MetadataStatus,
	EnvironmentsKeys,
	Datasource,
	DatasourceAdfView,
	DatasourceAdfTableView,
	DatasourceAdfTableViewColumn,
	ProductType,
} from './types';

/** @deprecated Use @atlaskit/linking-common/types */
export type { CardAdf, InlineCardAdf, BlockCardAdf, EmbedCardAdf, DatasourceAdf } from './types';

/** @deprecated Use @atlaskit/linking-common/constants */
export { DATASOURCE_DEFAULT_LAYOUT } from './common/utils/constants';

/** @deprecated Use @atlaskit/linking-common/actions */
export {
	ACTION_ERROR,
	ACTION_ERROR_FALLBACK,
	ACTION_PENDING,
	ACTION_PRELOAD,
	ACTION_RESOLVED,
	ACTION_RESOLVING,
	ACTION_RELOADING,
	ACTION_UPDATE_METADATA_STATUS,
	cardAction,
} from './actions';

/** @deprecated Use @atlaskit/linking-common/actions */
export type { CardActionParams, CardBaseActionCreator } from './actions';

/** @deprecated Use @atlaskit/linking-common/api/errors */
export { APIError, InvalidUrlError, NetworkError } from './errors';

/** @deprecated Use @atlaskit/linking-common/api/errors */
export type { APIErrorKind, ErrorType, ServerErrorType } from './errors';

/** @deprecated Use @atlaskit/linking-common/store */
export type { CardState, CardStore } from './store';

/** @deprecated Use @atlaskit/linking-common/store */
export { getUrl } from './store';

/** @deprecated Use @atlaskit/linking-common/utils/promise-debounce */
export { promiseDebounce } from './utils/promise-debounce';

/** @deprecated Use @atlaskit/linking-common/utils/get-status */
export { getStatus } from './utils/get-status';

/** @deprecated Use @atlaskit/linking-common/utils/filter-site-products */
export { filterSiteProducts } from './utils/filter-site-products';

/** @deprecated Use @atlaskit/linking-common/utils/with-feature-flagged-component */
export { withFeatureFlaggedComponent } from './utils/with-feature-flagged-component';

/** @deprecated Use @atlaskit/linking-common/client */
export { getBaseUrl, getResolverUrl, BaseUrls } from './environments';

/** @deprecated Use @atlaskit/linking-common/api */
export { request } from './api';

/** @deprecated Use @atlaskit/linking-common/pulse */
export { Pulse } from './components/Pulse';

/** @deprecated Use @atlaskit/linking-common/skeleton */
export { Skeleton, SpanSkeleton } from './components/Skeleton';

/** @deprecated No longer supported. Please declare type directly instead. */
export type Prettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};
