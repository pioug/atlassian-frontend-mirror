import React from 'react';

import { type MediaQuery } from '@atlaskit/primitives/responsive';

const getCssStringValue = (value: string | number): string =>
	typeof value === 'number' ? `${value}px` : value;

export const DangerouslyHoistCssVarToDocumentRoot = ({
	variableName,
	value,
	mediaQuery,
	responsiveValue,
}: {
	variableName: string;
	value: string | number;
	mediaQuery?: MediaQuery;
	responsiveValue?: string | number;
}): React.JSX.Element => {
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
	let style = `:root { ${variableName}: ${getCssStringValue(value)} }`;
	if (mediaQuery && responsiveValue) {
		style += ` ${mediaQuery} { :root { ${variableName}: ${getCssStringValue(responsiveValue)} } }`;
	}

	return (
		// Using a global style is required for SSR, as we can't use React hooks
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
		<style>{style}</style>
	);
};
