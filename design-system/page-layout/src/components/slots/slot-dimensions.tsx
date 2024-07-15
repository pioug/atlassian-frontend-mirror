import React from 'react';

import { UNSAFE_media } from '@atlaskit/primitives/responsive';

interface SlotDimensionsProps {
	variableName: string;
	value?: number;
	mobileValue?: number;
}

/**
 * Hoists slot dimension styles to the root element.
 */
const SlotDimensions = ({ variableName, value, mobileValue }: SlotDimensionsProps) => {
	/**
	 * Note don't put multiple variables in multiple lines. eg
	 * <style>
	 *   {css1}
	 *   {css2}
	 * </style>
	 *
	 * React will insert an empty HTML comment in between the text in SSR.
	 * This is not a valid tag and will break the page.
	 * <style>foo<!-- -->bar</style>
	 */
	let style = `:root{--${variableName}:${value}px;}`;
	if (mobileValue) {
		style += ` ${UNSAFE_media.below.sm} { :root{--${variableName}:${mobileValue}px;} }`;
	}
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
		<style>{style}</style>
	);
};

export default SlotDimensions;
