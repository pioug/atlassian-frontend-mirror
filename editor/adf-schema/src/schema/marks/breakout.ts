import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { breakout as breakoutFactory } from '../../next-schema/generated/markTypes';

const allowedTypes = ['wide', 'full-width'];

export type BreakoutMarkAttrs = {
	mode: 'wide' | 'full-width';
};

/**
 * @name breakout_mark
 */
export interface BreakoutMarkDefinition {
	attrs: BreakoutMarkAttrs;
	type: 'breakout';
}

export const breakout: MarkSpec = breakoutFactory({
	parseDOM: [
		{
			tag: 'div.fabric-editor-breakout-mark',
			getAttrs(dom) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const mode = (dom as HTMLElement).getAttribute('data-mode');
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const width = (dom as HTMLElement).getAttribute('data-width');

				return {
					mode: allowedTypes.indexOf(mode || '') === -1 ? 'wide' : mode,
					width: width ? parseInt(width) : null,
				};
			},
		},
	],
	toDOM(mark) {
		return [
			'div',
			{
				class: 'fabric-editor-breakout-mark',
				'data-mode': mark.attrs.mode,
				'data-width': mark.attrs?.width,
			},
			0,
		];
	},
});
