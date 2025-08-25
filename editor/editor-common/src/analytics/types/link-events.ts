import type { ACTION, ACTION_SUBJECT } from './enums';
import { type MODE, type PLATFORMS } from './general-events';
import { type TrackAEP } from './utils';

export type VisitedLinkAEP = TrackAEP<
	ACTION.VISITED,
	ACTION_SUBJECT.LINK,
	undefined,
	{
		mode: MODE;
		platform: PLATFORMS;
	},
	undefined
>;
