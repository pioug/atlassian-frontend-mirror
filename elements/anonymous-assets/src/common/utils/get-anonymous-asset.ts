import type { AnonymousAsset, GetAnonymousAvatarWithStylingProps } from '../../types';

import { ANONYMOUS_ASSETS } from './anonymous-assets';
import { getIntl } from './intl';
import { fetchWithRetry } from './retry';

export const encodeSvgToDataUri = (svgRoot: Element) => {
	// by this point we have a safe SVG string: we can safely string interpolate to encode as a
	// data:image to enable passing it to an <img> src attribute
	return `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svgRoot))}`;
};

export const objectToStyleString = (cssProperties: Record<string, string>) => {
	let styleString = '';
	Object.keys(cssProperties).forEach((key) => {
		styleString += `${key}: ${cssProperties[key]}; `;
	});
	return styleString;
};

/**
 * Applies additional styling to the SVG image by adding a style attribute to the SVG element
 */
export const addStyling = (svgRoot: Element, cssProperties: Record<string, string>) => {
	const styleRule = new CSSStyleSheet();

	const styleString = objectToStyleString(cssProperties);

	// even if styling is malicious, it will be sanitized by the CSSStyleSheet with the string being empty, ensuring safety
	styleRule.insertRule(`svg { ${styleString} }`);
	// we need to cast to CSSStyleRule to access the .style property
	const styleRuleString = (styleRule.cssRules[0] as CSSStyleRule).style.cssText;

	svgRoot.setAttribute('style', styleRuleString);
};

export const getAssetIndex = (index?: number) => {
	return index !== undefined
		? index % ANONYMOUS_ASSETS.length
		: Math.floor(Math.random() * ANONYMOUS_ASSETS.length);
};

export const svgStringToDomDocument = (svgString: string) => {
	return new DOMParser().parseFromString(svgString, 'image/svg+xml');
};

/**
 * Use this if custom styling needs to be applied to the svg element (such as background-color)
 * Loads a svg -> converts to a svg dom element -> applies styling -> converts to base64 encoded image
 * @param props
 */
export const getAnonymousAvatarWithStyling = async (
	props: GetAnonymousAvatarWithStylingProps,
): Promise<AnonymousAsset | undefined> => {
	const index = getAssetIndex(props?.index);
	const { id, messageDescriptor, src } = ANONYMOUS_ASSETS[index];
	const intl = await getIntl();

	const response = await fetchWithRetry({
		url: src,
		shouldRetryOnApiError: true,
		retries: props.retries || 3, // Maximum 3 retries
		options: props.options,
		baseDelay: props.baseDelay,
		maxDelay: props.maxDelay,
	});

	const svgString = await response.result?.text();

	if (!response.success) {
		throw new Error(`Error while fetching svg ${id} with src ${src}`);
	}
	if (!svgString) {
		throw new Error(`svg returned null with svg ${id} with src ${src}`);
	}

	const doc = svgStringToDomDocument(svgString);
	const svg = doc.documentElement;

	addStyling(svg, props.styleProperties);

	return {
		id,
		name: intl.formatMessage(messageDescriptor),
		src: encodeSvgToDataUri(svg),
	};
};

/**
 * Returns an anonymous asset. Use this if no additional svg modifications are needed
 * @param props.index if none is provided, a random anonymous asset it returned
 */
export const getAnonymousAsset = async (props?: { index?: number }): Promise<AnonymousAsset> => {
	const index = getAssetIndex(props?.index);
	const asset = ANONYMOUS_ASSETS[index];
	const intl = await getIntl();

	return {
		...asset,
		name: intl.formatMessage(asset.messageDescriptor),
	};
};

/**
 * Returns all anonymous assets
 */
export const getAllAnonymousAssets = async (): Promise<AnonymousAsset[]> => {
	const intl = await getIntl();

	return ANONYMOUS_ASSETS.map((asset) => ({
		id: asset.id,
		name: intl.formatMessage(asset.messageDescriptor),
		src: asset.src,
	}));
};
