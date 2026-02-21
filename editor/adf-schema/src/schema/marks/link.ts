import type { MarkSpec, Mark } from '@atlaskit/editor-prosemirror/model';
import { link as linkFactory } from '../../next-schema/generated/markTypes';
import { isRootRelative, isSafeUrl, normalizeUrl } from '../../utils/url';

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

export const getLinkAttrs =
	(attribute: string) =>
	(
		domNode: Node | string,
	):
		| false
		| {
				__confluenceMetadata: string;
				href?: string;
		  } => {
		const dom = domNode as HTMLLinkElement;

		const href = dom.getAttribute(attribute) || '';
		const attrs: { __confluenceMetadata: string; href?: string } = {
			__confluenceMetadata: dom.hasAttribute('__confluenceMetadata')
				? JSON.parse(dom.getAttribute('__confluenceMetadata') || '')
				: undefined,
		};

		if (!isSafeUrl(href)) {
			return false;
		}

		if (isRootRelative(href)) {
			attrs.href = href;
			return attrs;
		}

		attrs.href = normalizeUrl(href);
		return attrs;
	};

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

const OPTIONAL_ATTRS = ['title', 'id', 'collection', 'occurrenceKey', '__confluenceMetadata'];

export const toJSON = (
	mark: Mark,
): {
	attrs: Record<string, string>;
	type: string;
} => ({
	type: mark.type.name,
	attrs: Object.keys(mark.attrs).reduce<Record<string, string>>((attrs, key) => {
		if (OPTIONAL_ATTRS.indexOf(key) === -1 || mark.attrs[key] !== null) {
			attrs[key] = mark.attrs[key];
		}
		return attrs;
	}, {}),
});
