import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { confluenceUnsupportedInline as confluenceUnsupportedInlineFactory } from '../../next-schema/generated/nodeTypes';

const name = 'confluenceUnsupportedInline';

export const confluenceUnsupportedInline: NodeSpec =
	confluenceUnsupportedInlineFactory({
		toDOM(node) {
			const attrs = {
				'data-node-type': name,
				'data-confluence-unsupported': 'inline',
				'data-confluence-unsupported-inline-cxhtml': node.attrs['cxhtml'],
			};
			return ['div', attrs, 'Unsupported content'];
		},
		parseDOM: [
			{
				tag: `div[data-node-type="${name}"]`,
				getAttrs(dom) {
					return {
						// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
						cxhtml: (dom as HTMLElement).getAttribute(
							'data-confluence-unsupported-inline-cxhtml',
						)!,
					};
				},
			},
		],
	});
