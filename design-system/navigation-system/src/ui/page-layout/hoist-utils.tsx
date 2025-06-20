import React from 'react';

import { type MediaQuery } from '@atlaskit/primitives/responsive';

import { gridRootId } from './root';

/**
 * This is not ideal and shouldn't be used by anything outside of `<Banner>` and `<TopNav>`.
 *
 * This makes the other page layout elements aware that the banner and top bar have been mounted, provides them
 * with their heights. This is needed to power the stick points of page layout elements like SideNav and Panel.
 *
 * We should clean this up once we have a better solution, such as moving the size props for banner and top bar into `Root`.
 */
export const HoistCssVarToLocalGrid = ({
	variableName,
	value,
}: {
	variableName: string;
	value: number;
	// Using a global style is required for SSR, as we can't use React hooks
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
}) => <style>{`#${gridRootId} { ${variableName}: ${value}px }`}</style>;

const getCssStringValue = (value: string | number): string =>
	typeof value === 'number' ? `${value}px` : value;

/**
 * Hoists CSS variables to the document root. This is support the legacy edge case of monolith pages being injected as a
 * sibling to the page layout, as opposed to within the `Main` slot.
 */
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
}) => {
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
