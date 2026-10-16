import type { ACTION, ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { TrackAEP } from './utils';

export type NumberedHeadingsToggledAEP = TrackAEP<
	ACTION.TOGGLED,
	ACTION_SUBJECT.NUMBERED_HEADINGS,
	undefined,
	{
		enabled: boolean;
		headingCount: number;
		inputMethod: INPUT_METHOD.TOOLBAR;
	},
	undefined
>;

export type NumberedHeadingsEventPayload = NumberedHeadingsToggledAEP;
