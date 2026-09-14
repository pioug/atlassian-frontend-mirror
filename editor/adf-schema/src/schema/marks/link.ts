/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';

import { link as linkFactory } from '../../next-schema/generated/markTypes';
import { isSafeUrl } from '../../utils/is-safe-url';
import { getLinkAttrs } from './get-link-attrs';

export interface ConfluenceLinkMetadata {
	anchorName?: string | null;
	container?: ConfluenceLinkMetadata;
	contentId?: string | null;
	contentTitle?: string | null;
	fileName?: string | null;
	isRenamedTitle?: boolean;
	linkType: string;
	spaceKey?: string | null;
	versionAtSave?: string | null;
}

export interface LinkAttributes {
	__confluenceMetadata?: ConfluenceLinkMetadata;
	collection?: string;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @validatorFn safeUrl
	 */
	href: string;
	id?: string;
	occurrenceKey?: string;

	title?: string;
}

/**
 * @name link_mark
 */
export interface LinkDefinition {
	attrs: LinkAttributes;
	type: 'link';
}

export const link: MarkSpec = linkFactory({
	parseDOM: [
		{
			tag: '[data-block-link]',
			getAttrs: getLinkAttrs('data-block-link'),
			contentElement: (node) => {
				const clone = node.cloneNode(true);
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(clone as HTMLElement).removeAttribute('data-block-link');
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(clone as HTMLElement).setAttribute('data-skip-paste', 'true');
				const wrapper = document.createElement('div');
				wrapper.appendChild(clone);
				return wrapper;
			},
		},
		{
			tag: 'a[href]',
			getAttrs: getLinkAttrs('href'),
		},
	],
	toDOM(node, isInline) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const attrs = Object.keys(node.attrs).reduce<any>((attrs, key) => {
			if (key === '__confluenceMetadata') {
				if (node.attrs[key] !== null) {
					attrs[key] = JSON.stringify(node.attrs[key]);
				}
			} else if (key === 'href') {
				attrs[key] = isSafeUrl(node.attrs[key]) ? node.attrs[key] : undefined;
			} else {
				// @ts-ignore
				attrs[key] = node.attrs[key];
			}

			return attrs;
		}, {});

		if (isInline) {
			return ['a', attrs];
		}

		return [
			'a',
			{
				...attrs,
				['data-block-link']: 'true',
				class: 'blockLink',
			},
			0,
		];
	},
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { toJSON } from './to-json';
