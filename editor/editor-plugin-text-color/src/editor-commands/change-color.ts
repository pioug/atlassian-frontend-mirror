import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { getHadMarkAttributes } from '@atlaskit/editor-common/mark';
import { FORMAT_SELECTION_SYNC_META } from '@atlaskit/editor-common/selection';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { getActiveColorNew } from '../pm-plugins/utils/color';
import type { TextColorPlugin } from '../textColorPluginType';
import type { TextColorInputMethod } from '../types';
import { removeColor } from './remove-color';
import { toggleColor } from './toggle-color';

const maybeSyncSelectionAfterFormat = (tr: Transaction) => {
	if (tr.docChanged) {
		tr.setMeta(FORMAT_SELECTION_SYNC_META, true);
	}
};

/**
 * Helper to create an analytics payload
 * @param newColor  - Color to be change in hex code
 * @param previousColor - Active color in hex code
 * @param palette - Current palette of colors
 * @returns Higher order command with analytics logic inside.
 */
function createColorAnalyticsPayload(
	newColor: string,
	previousColor: string | null,
	palette: PaletteColor[],
	inputMethod?: TextColorInputMethod,
	hadMarkAttributes: { hadBackgroundColor?: boolean } = {},
) {
	const newColorFromPalette = palette.find(({ value }) => value === newColor);
	const previousColorFromPalette = palette.find(({ value }) => value === previousColor);

	const newColorLabel = newColorFromPalette ? newColorFromPalette.label : newColor;
	const previousColorLabel = previousColorFromPalette
		? previousColorFromPalette.label
		: previousColor || '';

	return {
		action: ACTION.FORMATTED,
		actionSubject: ACTION_SUBJECT.TEXT,
		actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			newColor: newColorLabel.toLowerCase(),
			previousColor: previousColorLabel.toLowerCase(),
			inputMethod,
			...hadMarkAttributes,
		},
	} as const;
}

export const changeColor =
	(
		color: string,
		api: ExtractInjectionAPI<TextColorPlugin> | undefined,
		inputMethod?: TextColorInputMethod,
	): EditorCommand =>
	({ tr }) => {
		const { textColor, backgroundColor } = tr.doc.type.schema.marks;
		const pluginState = api?.textColor.sharedState.currentState();

		if (!textColor || !pluginState) {
			return tr;
		}

		const activeColor = getActiveColorNew(tr);
		const isRemovingColor = color === pluginState.defaultColor;
		const hadMarkAttributes = isRemovingColor ? {} : getHadMarkAttributes(tr, [backgroundColor]);

		const colorAnalyticsPayload = createColorAnalyticsPayload(
			color,
			activeColor,
			pluginState.palette,
			inputMethod,
			hadMarkAttributes,
		);

		if (pluginState.disabled) {
			return tr;
		}

		if (isRemovingColor) {
			api?.analytics?.actions.attachAnalyticsEvent(colorAnalyticsPayload)(tr);
			removeColor({ tr });
			maybeSyncSelectionAfterFormat(tr);
			return tr;
		}

		api?.analytics?.actions.attachAnalyticsEvent(colorAnalyticsPayload)(tr);
		toggleColor(color)({ tr });
		maybeSyncSelectionAfterFormat(tr);
		return tr;
	};
