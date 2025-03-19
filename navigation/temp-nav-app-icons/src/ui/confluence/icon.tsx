/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2d63aa066001c65d576939365a014dde>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" fill="none" viewBox="0 0 32 32">
    <path fill="var(--tile-color,#1868db)" d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
    <path fill="var(--icon-color, white)" d="M23.85 19.282c-5.385-2.604-6.958-2.993-9.227-2.993-2.662 0-4.93 1.107-6.957 4.22l-.333.508c-.272.42-.333.569-.333.749s.09.329.424.538l3.418 2.125c.181.12.333.18.484.18.182 0 .303-.09.484-.36l.545-.837c.847-1.287 1.603-1.706 2.571-1.706.847 0 1.845.24 3.086.838l3.57 1.676c.363.18.756.09.937-.33l1.694-3.71c.182-.42.06-.689-.363-.898m-15.7-6.555c5.384 2.604 6.958 2.993 9.227 2.993 2.662 0 4.93-1.107 6.958-4.22l.332-.509c.272-.419.333-.568.333-.748s-.09-.329-.424-.539L21.159 7.58c-.181-.12-.333-.18-.484-.18-.182 0-.303.09-.484.36l-.545.837c-.847 1.287-1.603 1.706-2.571 1.706-.847 0-1.845-.24-3.086-.838l-3.57-1.676c-.362-.18-.756-.09-.937.33l-1.694 3.71c-.182.42-.061.689.363.898"/>
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
export function ConfluenceIcon({ size, appearance = 'brand', label, testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			size={size}
			appearance={appearance}
			label={label || 'Confluence'}
			testId={testId}
		/>
	);
}
