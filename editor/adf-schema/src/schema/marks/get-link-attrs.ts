import { isRootRelative } from '../../utils/is-root-relative';
import { isSafeUrl } from '../../utils/is-safe-url';
import { normalizeUrl } from '../../utils/normalize-url';

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
