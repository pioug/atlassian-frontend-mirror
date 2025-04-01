/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::471f81ad8bbbe4db786095f5e504cb05>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { ThemedIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#c97cf4)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M13.086 5.226c1.908.56 3.834.56 5.742 0 .169-.037.28.075.244.243-.543 1.958-.543 3.768 0 5.727.037.15-.075.28-.244.224a10.7 10.7 0 0 0-5.742 0c-.15.056-.28-.075-.224-.224.505-1.959.505-3.769 0-5.727-.056-.168.074-.28.224-.243m.767 6.94v.317c0 1.474-1.029 2.556-2.3 2.556a2.28 2.28 0 0 1-2.283-2.295c0-1.268 1.03-2.276 2.47-2.276h.373V6.01c-.187-.019-.374-.019-.56-.019a6.764 6.764 0 0 0-6.772 6.772c0 3.75 3.03 6.753 6.771 6.753s6.79-3.022 6.79-6.753v-.597z"/>
</svg>
`;
const customThemeSvg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--themed-icon-color, currentcolor)" fill-rule="evenodd" d="M6 0a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm12.828 5.226a10.03 10.03 0 0 1-5.742 0c-.15-.037-.28.075-.224.243.505 1.959.505 3.768 0 5.727-.056.15.074.28.224.224a10.7 10.7 0 0 1 5.742 0c.169.056.28-.075.244-.224-.543-1.959-.543-3.768 0-5.727.037-.168-.075-.28-.244-.243m-4.975 7.257v-.317h4.489v.597c0 3.731-3.049 6.753-6.79 6.753a6.75 6.75 0 0 1-6.77-6.753c0-3.75 3.03-6.772 6.77-6.772.187 0 .374 0 .561.019v4.458h-.374c-1.44 0-2.469 1.008-2.469 2.276a2.28 2.28 0 0 0 2.282 2.295c1.272 0 2.3-1.082 2.3-2.556" clip-rule="evenodd"/>
</svg>
`;

/**
 * __JiraProductDiscoveryIcon__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function JiraProductDiscoveryIcon({
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
			label={label || 'Jira Product Discovery'}
			testId={testId}
		/>
	);
}
