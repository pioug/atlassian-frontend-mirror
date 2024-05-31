import type { ACTION, ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

type LoomPluginErrorMessages =
	| 'is-supported-failure'
	| 'failed-to-initialise'
	| 'api-key-not-provided';
type LoomSDKErrorMessages =
	| 'incompatible-browser'
	| 'third-party-cookies-disabled'
	| 'no-media-streams-support';

type LoomInitialisedAEP = OperationalAEP<
	ACTION.INITIALISED,
	ACTION_SUBJECT.LOOM,
	undefined,
	undefined
>;

type LoomDisabledAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.LOOM,
	undefined,
	{ error?: LoomPluginErrorMessages | LoomSDKErrorMessages }
>;

type RecordVideoAEP = TrackAEP<
	ACTION.RECORD_VIDEO,
	ACTION_SUBJECT.LOOM,
	undefined,
	{ inputMethod: INPUT_METHOD },
	undefined
>;

type RecordVideoFailedAEP = TrackAEP<
	ACTION.RECORD_VIDEO_FAILED,
	ACTION_SUBJECT.LOOM,
	undefined,
	{
		inputMethod: INPUT_METHOD;
		error?: LoomPluginErrorMessages | LoomSDKErrorMessages;
	},
	undefined
>;

type InsertVideoAEP = TrackAEP<
	ACTION.INSERT_VIDEO,
	ACTION_SUBJECT.LOOM,
	undefined,
	{ duration?: number },
	undefined
>;

export type LoomEventPayload =
	| LoomInitialisedAEP
	| LoomDisabledAEP
	| RecordVideoAEP
	| RecordVideoFailedAEP
	| InsertVideoAEP;
