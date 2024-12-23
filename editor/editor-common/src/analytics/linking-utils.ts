import type { CardAppearance } from '@atlaskit/smart-card';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from './types/enums';
import type { AnalyticsEventPayload } from './types/events';

export const buildEditLinkPayload = (type: LinkType): AnalyticsEventPayload => {
	return {
		action: ACTION.CLICKED,
		actionSubject:
			type === ACTION_SUBJECT_ID.HYPERLINK ? ACTION_SUBJECT.HYPERLINK : ACTION_SUBJECT.SMART_LINK,
		actionSubjectId: ACTION_SUBJECT_ID.EDIT_LINK,
		attributes:
			type !== ACTION_SUBJECT_ID.HYPERLINK
				? {
						// @ts-ignore
						display: type,
					}
				: {},
		eventType: EVENT_TYPE.UI,
	};
};

export type LinkType =
	| ACTION_SUBJECT_ID.CARD_INLINE
	| ACTION_SUBJECT_ID.CARD_BLOCK
	| ACTION_SUBJECT_ID.EMBEDS
	| ACTION_SUBJECT_ID.HYPERLINK;

const mapLinkTypeToCardAppearance = (type: LinkType): CardAppearance | 'url' => {
	switch (type) {
		case ACTION_SUBJECT_ID.CARD_INLINE: {
			return 'inline';
		}
		case ACTION_SUBJECT_ID.CARD_BLOCK: {
			return 'block';
		}
		case ACTION_SUBJECT_ID.EMBEDS: {
			return 'embed';
		}
		default: {
			return 'url';
		}
	}
};

export const buildVisitedLinkPayload = (type: LinkType): AnalyticsEventPayload => {
	return type === ACTION_SUBJECT_ID.HYPERLINK
		? {
				action: ACTION.VISITED,
				actionSubject: ACTION_SUBJECT.HYPERLINK,
				actionSubjectId: undefined,
				attributes: {
					inputMethod: INPUT_METHOD.TOOLBAR,
				},
				eventType: EVENT_TYPE.TRACK,
			}
		: {
				action: ACTION.VISITED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				actionSubjectId: type as ACTION_SUBJECT_ID.CARD_INLINE | ACTION_SUBJECT_ID.CARD_BLOCK,
				attributes: {
					inputMethod: INPUT_METHOD.TOOLBAR,
				},
				eventType: EVENT_TYPE.TRACK,
			};
};

export const buildOpenedSettingsPayload = (type: LinkType): AnalyticsEventPayload => {
	return {
		action: ACTION.CLICKED,
		actionSubject: ACTION_SUBJECT.BUTTON,
		actionSubjectId: ACTION_SUBJECT_ID.GOTO_SMART_LINK_SETTINGS,
		attributes: {
			// @ts-ignore
			inputMethod: INPUT_METHOD.TOOLBAR,
			display: mapLinkTypeToCardAppearance(type),
		},
		eventType: EVENT_TYPE.UI,
	};
};

export const unlinkPayload = (type: LinkType) => {
	return {
		action: ACTION.UNLINK,
		actionSubject:
			type === ACTION_SUBJECT_ID.HYPERLINK ? ACTION_SUBJECT.HYPERLINK : ACTION_SUBJECT.SMART_LINK,
		actionSubjectId:
			type === ACTION_SUBJECT_ID.HYPERLINK ? undefined : (type as ACTION_SUBJECT_ID.CARD_INLINE),
		attributes: {
			inputMethod: INPUT_METHOD.TOOLBAR,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};
