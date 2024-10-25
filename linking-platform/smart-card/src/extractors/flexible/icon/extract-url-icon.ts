import { type JsonLd } from 'json-ld-types';

import { extractUrlFromIconJsonLd } from '@atlaskit/link-extractors';

import { type IconDescriptor } from './types';

/**
 * Extracts the URL icon from the given icon or link object.
 *
 * @param icon - The icon or link object from which to extract the URL icon.
 * @param label - The label for the URL icon.
 * @returns IconDescriptor, which will contain label and url, or undefined
 */
const extractUrlIcon = (
	icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
	label?: string,
): IconDescriptor | undefined => {
	const url = icon && extractUrlFromIconJsonLd(icon);
	return url ? { label, url } : undefined;
};

export default extractUrlIcon;
