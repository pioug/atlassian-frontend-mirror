/** @deprecated Use @atlaskit/linking-types/datasource */
export type {
	Access,
	DateRange,
	DateRangeType,
	AuthService,
	BooleanType,
	DatasourceData,
	DatasourceDataRequest,
	DatasourceDataResponse,
	DatasourceDataResponseItem,
	DatasourceDetails,
	DatasourceDetailsRequest,
	DatasourceDetailsResponse,
	DatasourceDataSchema,
	DatasourceDetailsSchema,
	DatasourceMeta,
	DatasourceParameters,
	DatasourceResponseParameter,
	DatasourceResponseSchemaProperty,
	DatasourceTableStatusType,
	DatasourceType,
	DateTimeType,
	DateType,
	Icon,
	IconType,
	Link,
	LinkType,
	NumberType,
	RichText,
	RichTextType,
	Status,
	StatusType,
	StringType,
	Tag,
	TagType,
	TimeType,
	User,
	UserType,
	Visibility,
} from './entry-points/datasource-types';

/** @deprecated Use @atlaskit/linking-types/datasource-actions */
export type {
	ActionsDiscoveryRequest,
	PermissionTypes,
	PermissionInterface,
	AtomicActionInterface,
	ActionsServiceDiscoveryResponse,
	ActionsDiscoveryResponse,
	AtomicActionExecuteRequest,
	AtomicActionExecuteResponse,
	ActionsServiceError,
} from './entry-points/datasource-action-types';

/** @deprecated Use @atlaskit/linking-types/datasource-actions */
export { ActionOperationStatus } from './entry-points/datasource-action-types';

/** @deprecated Use @atlaskit/linking-types/smart-link-actions */
export type {
	InvokeRequest,
	InvokeRequestAction,
	StatusUpdateActionPayload,
	InvokeResponse,
	InvokeErrorResponse,
	GetStatusTransitionsInvokeResponse,
} from './entry-points/smart-link-action-types';

/** @deprecated Use @atlaskit/linking-types/smart-link-actions */
export { SmartLinkActionType, InvokeError } from './entry-points/smart-link-action-types';

/** @deprecated Use @atlaskit/linking-types/supported-feature */
export type { SupportedFeature } from './supported-feature';

/** @deprecated Use @atlaskit/linking-types/entity-types */
export type { EntityType, DesignEntity } from './entry-points/entity-types';

/** @deprecated Use @atlaskit/linking-types/smart-link */
export type { SmartLinkResponse, ProviderGenerator } from './smart-link-types';
