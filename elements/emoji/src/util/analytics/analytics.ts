// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	createAndFireEvent,
	UIAnalyticsEvent,
	type AnalyticsEventPayload,
	type CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
	type EmojiDescription,
	type OptionalEmojiDescription,
	SearchSourceTypes,
} from '../../types';

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent('fabric-elements');

const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	actionSubjectId?: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	actionSubjectId,
	attributes: {
		packageName: process.env._PACKAGE_NAME_,
		packageVersion: process.env._PACKAGE_VERSION_,
		...attributes,
	},
});

export type EmojiInsertionAnalytic = (
	source: SearchSourceTypes.PICKER | SearchSourceTypes.TYPEAHEAD,
) => AnalyticsEventPayload;

export const recordSucceededEmoji =
	(emoji: OptionalEmojiDescription) =>
	(source: SearchSourceTypes): AnalyticsEventPayload => {
		return createEvent('operational', 'succeeded', 'recordEmojiSelection', undefined, {
			source,
			emojiId: emoji?.id,
			emojiType: emoji?.type,
			emojiCategory: emoji?.category,
		});
	};

export const recordSucceeded: EmojiInsertionAnalytic = (source: SearchSourceTypes) => {
	return createEvent('operational', 'succeeded', 'recordEmojiSelection', undefined, {
		source,
	});
};

export const recordFailedEmoji =
	(emoji: OptionalEmojiDescription) =>
	(source: SearchSourceTypes): AnalyticsEventPayload => {
		return createEvent('operational', 'failed', 'recordEmojiSelection', undefined, {
			source,
			emojiId: emoji?.id,
			emojiType: emoji?.type,
			emojiCategory: emoji?.category,
		});
	};

export const recordFailed: EmojiInsertionAnalytic = (source: SearchSourceTypes) => {
	return createEvent('operational', 'failed', 'recordEmojiSelection', undefined, {
		source,
	});
};
interface Duration {
	duration: number;
}

const emojiPickerEvent = (action: string, attributes = {}, actionSubjectId?: string) =>
	createEvent('ui', action, 'emojiPicker', actionSubjectId, attributes);

export const openedPickerEvent = (): AnalyticsEventPayload => emojiPickerEvent('opened');

export const closedPickerEvent = (attributes: Duration): AnalyticsEventPayload =>
	emojiPickerEvent('closed', attributes);

interface EmojiAttributes {
	baseEmojiId?: string; // mobile only
	category: string;
	emojiId: string;
	skinToneModifier?: string;
	type: string;
}

const skinTones = [
	{ id: '-1f3fb', skinToneModifier: 'light' },
	{ id: '-1f3fc', skinToneModifier: 'mediumLight' },
	{ id: '-1f3fd', skinToneModifier: 'medium' },
	{ id: '-1f3fe', skinToneModifier: 'mediumDark' },
	{ id: '-1f3ff', skinToneModifier: 'dark' },
];

const getSkinTone = (emojiId?: string) => {
	if (!emojiId) {
		return {};
	}
	for (const { id, skinToneModifier } of skinTones) {
		if (emojiId.indexOf(id) !== -1) {
			return { skinToneModifier, baseEmojiId: emojiId.replace(id, '') };
		}
	}

	return {};
};

export const pickerClickedEvent = (
	attributes: { queryLength: number } & EmojiAttributes & Duration,
): AnalyticsEventPayload =>
	emojiPickerEvent(
		'clicked',
		{
			...getSkinTone(attributes.emojiId),
			...attributes,
		},
		'emoji',
	);

export const categoryClickedEvent = (attributes: { category: string }): AnalyticsEventPayload =>
	emojiPickerEvent('clicked', attributes, 'category');

export const pickerSearchedEvent = (attributes: {
	numMatches: number;
	queryLength: number;
}): AnalyticsEventPayload => emojiPickerEvent('searched', attributes, 'query');

const skintoneSelectorEvent = (action: string, attributes = {}) =>
	createEvent('ui', action, 'emojiSkintoneSelector', undefined, attributes);

export const toneSelectedEvent = (attributes: {
	skinToneModifier: string;
}): AnalyticsEventPayload => skintoneSelectorEvent('clicked', attributes);

export const toneSelectorOpenedEvent = (attributes: {
	skinToneModifier?: string;
}): AnalyticsEventPayload => skintoneSelectorEvent('opened', attributes);

export const toneSelectorClosedEvent = (): AnalyticsEventPayload =>
	skintoneSelectorEvent('cancelled');

const emojiUploaderEvent = (action: string, actionSubjectId?: string, attributes?: any) =>
	createEvent('ui', action, 'emojiUploader', actionSubjectId, attributes);

export const uploadBeginButton = (): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'addButton');

export const uploadConfirmButton = (attributes: { retry: boolean }): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'confirmButton', attributes);

export const uploadCancelButton = (): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'cancelButton');

export const uploadSucceededEvent = (attributes: Duration): AnalyticsEventPayload =>
	createEvent('operational', 'finished', 'emojiUploader', undefined, attributes);

export const uploadFailedEvent = (
	attributes: { reason: string } & Duration,
): AnalyticsEventPayload =>
	createEvent('operational', 'failed', 'emojiUploader', undefined, attributes);

interface Attributes {
	emojiId?: string;
}

export const deleteBeginEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiTrigger', attributes);

export const deleteConfirmEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiConfirm', attributes);

export const deleteCancelEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiCancel', attributes);

export const selectedFileEvent = (): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');

interface CommonAttributes {
	emojiIds: string[];
	queryLength: number;
	spaceInQuery: boolean;
}

const extractCommonAttributes = (
	query?: string,
	emojiList?: EmojiDescription[],
): CommonAttributes => {
	return {
		queryLength: query ? query.length : 0,
		spaceInQuery: query ? query.indexOf(' ') !== -1 : false,
		emojiIds: emojiList
			? emojiList
					.map((emoji) => emoji.id!)
					.filter(Boolean)
					.slice(0, 20)
			: [],
	};
};

export const typeaheadCancelledEvent = (
	duration: number,
	query?: string,
	emojiList?: EmojiDescription[],
): AnalyticsEventPayload =>
	createEvent('ui', 'cancelled', 'emojiTypeahead', undefined, {
		duration,
		...extractCommonAttributes(query, emojiList),
	});

const getPosition = (
	emojiList: EmojiDescription[] | undefined,
	selectedEmoji: EmojiDescription,
): number | undefined => {
	if (emojiList) {
		const index = emojiList.findIndex((emoji) => emoji.id === selectedEmoji.id);
		return index === -1 ? undefined : index;
	}
	return;
};

export const typeaheadSelectedEvent = (
	pressed: boolean,
	duration: number,
	emoji: EmojiDescription,
	emojiList?: EmojiDescription[],
	query?: string,
	exactMatch?: boolean,
): AnalyticsEventPayload =>
	createEvent('ui', pressed ? 'pressed' : 'clicked', 'emojiTypeahead', undefined, {
		duration,
		position: getPosition(emojiList, emoji),
		...extractCommonAttributes(query, emojiList),
		...getSkinTone(emoji.id),
		emojiType: emoji.type,
		exactMatch: exactMatch || false,
	});

export const typeaheadRenderedEvent = (
	duration: number,
	query?: string,
	emojiList?: EmojiDescription[],
): AnalyticsEventPayload =>
	createEvent('operational', 'rendered', 'emojiTypeahead', undefined, {
		duration,
		...extractCommonAttributes(query, emojiList),
	});

// it's used in editor typeahead to fire success record analytics
export const recordSelectionSucceededSli =
	(emoji: OptionalEmojiDescription, options?: { createAnalyticsEvent?: CreateUIAnalyticsEvent }) =>
	(): void => {
		if (options && options.createAnalyticsEvent) {
			createAndFireEvent('editor')(recordSucceededEmoji(emoji)(SearchSourceTypes.TYPEAHEAD))(
				options.createAnalyticsEvent,
			);
		}
	};

// it's used in editor typeahead to fire failure record analytics
export const recordSelectionFailedSli =
	(emoji: OptionalEmojiDescription, options?: { createAnalyticsEvent?: CreateUIAnalyticsEvent }) =>
	(err: Error): Promise<never> => {
		if (options && options.createAnalyticsEvent) {
			createAndFireEvent('editor')(recordFailedEmoji(emoji)(SearchSourceTypes.TYPEAHEAD))(
				options.createAnalyticsEvent,
			);
		}
		return Promise.reject(err);
	};

/**
 * Used for store failure metadata for analytics
 * @param error The error could be a service error with {code, reason} or an Error
 * @returns any
 */
export const extractErrorInfo = (error: any): any => {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
		};
	}
	return error;
};
