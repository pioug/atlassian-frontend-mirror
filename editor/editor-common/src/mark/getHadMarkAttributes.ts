import type { MarkType } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { anyMarksActiveFromTr } from './anyMarksActiveFromTr';

const HAD_ATTRIBUTE = {
	backgroundColor: 'hadBackgroundColor',
	link: 'hadLink',
	textColor: 'hadTextColor',
} as const;

type MarkName = keyof typeof HAD_ATTRIBUTE;

export type HadMarkAttribute = (typeof HAD_ATTRIBUTE)[MarkName];

const isMarkName = (name: string): name is MarkName => name in HAD_ATTRIBUTE;

/**
 * `had*` flags for color / highlight / link apply events.
 * Kill switch `platform_editor_add_text_color_tracking`: gate on, new attributes off.
 */
export const getHadMarkAttributes = (
	tr: Transaction | ReadonlyTransaction,
	markTypes: readonly (MarkType | undefined)[],
): Partial<Record<HadMarkAttribute, boolean>> => {
	if (fg('platform_editor_add_text_color_tracking')) {
		return {};
	}

	const definedMarkTypes = markTypes.filter((markType): markType is MarkType => !!markType);
	const found = anyMarksActiveFromTr(tr, definedMarkTypes);
	const result: Partial<Record<HadMarkAttribute, boolean>> = {};

	for (let i = 0; i < definedMarkTypes.length; i++) {
		const markName = definedMarkTypes[i].name;
		if (isMarkName(markName)) {
			result[HAD_ATTRIBUTE[markName]] = Boolean(found[i]);
		}
	}

	return result;
};
