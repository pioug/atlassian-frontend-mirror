/**
 * @private
 * @deprecated API - clean up with next reactUFO major version
 */
export type AssetResourceEntry = any;
/**
 * @private
 * @deprecated API - clean up with next reactUFO major version
 */
export type AssetsClassification = any;

export type {
	AssetsConfig,
	AssetsData,
	AssetsReporter,
	AssetsConfigAllAtlassianArgs,
	AssetsConfigPreloadedArgs,
} from './assets/types';

export type {
	LifecycleMarkType,
	MarkType,
	SpanType,
	InteractionType,
	AbortReasonType,
	CustomTiming,
	HoldInfo,
	LoadProfilerEventInfo,
	ReactProfilerTiming,
	Span,
	Mark,
	InteractionError,
	RequestInfo,
	ApdexType,
	SegmentInfo,
	CustomData,
	HoldActive,
	Redirect,
	InteractionMetrics,
	EnhancedUFOInteractionContextType,
	BM3Event,
	PostInteractionLogOutput,
	LastInteractionFinishInfo,
} from './common/types';

export type { MultiHeatmapPayload } from './vc/types';

/**
 * @deprecated Prefer import from @atlaskit/react-ufo/interaction-context
 */
export type { Label, SegmentLabel, LabelStack } from '../interaction-context';
