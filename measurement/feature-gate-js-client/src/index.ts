export type {
	AnalyticsWebClient,
	BaseClientOptions,
	CheckGateOptions,
	ClientOptions,
	CustomAttributes,
	FrontendExperimentsResult,
	FromValuesClientOptions,
	GetExperimentOptions,
	GetExperimentValueOptions,
	Identifiers,
	InitializeValues,
	UpdateUserCompletionCallback,
	OptionsWithDefaults,
	Provider,
} from './client/FeatureGates';

export type { LocalOverrides } from './client/PersistentOverrideAdapter';

export { default } from './client/FeatureGates';
export { FeatureGateEnvironment, PerimeterType } from './client/types';
export { CLIENT_VERSION } from './client/version';

export { DynamicConfig } from './client/compat/DynamicConfig';
export { Layer } from './client/compat/Layer';
export { EvaluationReason, type EvaluationDetails } from './client/compat/types';
