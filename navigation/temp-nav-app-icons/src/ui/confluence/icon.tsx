/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::41d89757012eaeae17d9864fcd61e749>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M23.85 19.282c-5.385-2.604-6.958-2.993-9.227-2.993-2.662 0-4.93 1.107-6.957 4.22l-.333.508c-.272.42-.333.569-.333.749s.09.329.424.538l3.418 2.125c.181.12.333.18.484.18.182 0 .303-.09.484-.36l.545-.837c.847-1.287 1.603-1.706 2.571-1.706.847 0 1.845.24 3.086.838l3.57 1.676c.363.18.756.09.937-.33l1.694-3.71c.182-.42.06-.689-.363-.898m-15.7-6.555c5.384 2.604 6.958 2.993 9.227 2.993 2.662 0 4.93-1.107 6.958-4.22l.332-.509c.272-.419.333-.568.333-.748s-.09-.329-.424-.539L21.159 7.58c-.181-.12-.333-.18-.484-.18-.182 0-.303.09-.484.36l-.545.837c-.847 1.287-1.603 1.706-2.571 1.706-.847 0-1.845-.24-3.086-.838l-3.57-1.676c-.362-.18-.756-.09-.937.33l-1.694 3.71c-.182.42-.061.689.363.898"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M8 0a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8zm-.536 10.9c.248-.535.735-1.57 1.081-2.302.347-.732.658-1.33.691-1.33.034 0 1.614.736 3.512 1.637 2.915 1.382 3.554 1.637 4.105 1.637 1.237 0 2.044-.553 3.048-2.088.352-.54.69-1.038.75-1.106.123-.14 4.348 2.366 4.349 2.58 0 .076-.366.698-.815 1.383-1.491 2.28-3.47 3.75-5.665 4.21-1.223.257-1.884.256-3.147-.005-1.212-.25-1.428-.34-5.335-2.203l-3.025-1.442zm.1 10.308c1.618-2.607 3.623-4.224 5.877-4.738 1.106-.253 2.9-.162 4.08.206.86.268 7.13 3.172 7.4 3.427.115.108-1.916 4.63-2.08 4.63-.036 0-1.568-.716-3.403-1.591-3.54-1.688-4.16-1.874-5.155-1.546-.72.238-1.619 1.112-2.27 2.207-.303.511-.604.93-.668.93-.104 0-1.858-1.047-3.702-2.21L7 22.118z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ConfluenceIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function ConfluenceIcon({
	size,
	appearance = 'brand',
	iconColor,
	label,
	testId,
}: ThemedIconProps) {
	return (
		<IconWrapper
			svg={svg}
			customThemeSvg={customThemeSvg}
			size={size}
			appearance={appearance}
			iconColor={iconColor}
			label={label || 'Confluence'}
			testId={testId}
		/>
	);
}
