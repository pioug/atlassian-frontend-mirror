/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a5ec5ca28f66bebf0814cbeae4e9f524>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 71 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M5.875 10.688v7.437h4.375V13.75h3.5v4.375h4.375v-7.437L12 5z"/>
    <path fill="var(--text-color, #292a2e)" d="M66.03 17.15q-1.16 0-2-.48a3.26 3.26 0 0 1-1.29-1.37q-.45-.88-.45-2.08 0-1.18.44-2.06a3.4 3.4 0 0 1 1.26-1.39q.82-.5 1.93-.5.72 0 1.36.23t1.14.71q.49.47.77 1.2t.28 1.72v.57h-6.34v-1.25h5.39l-.9.35a2.8 2.8 0 0 0-.19-1.08 1.55 1.55 0 0 0-.57-.72q-.37-.26-.93-.26-.55 0-.94.26t-.59.7q-.21.44-.21.99v.88q0 .69.23 1.17.24.47.66.71t.99.24q.37 0 .68-.11t.53-.31a1.4 1.4 0 0 0 .34-.52l1.75.34q-.18.62-.64 1.09-.45.46-1.13.73-.68.25-1.54.25M49.91 17V9.36h1.8l.08 1.87h-.14q.17-.7.51-1.13.35-.44.81-.64.47-.21.97-.21.83 0 1.33.52.51.52.73 1.57h-.23q.17-.71.55-1.18.39-.46.91-.69.53-.23 1.12-.23.69 0 1.24.3t.87.88.32 1.42V17h-1.92v-4.82q0-.67-.37-1a1.32 1.32 0 0 0-.9-.32q-.4 0-.7.18a1.2 1.2 0 0 0-.46.49q-.16.32-.16.73V17H54.4v-4.89q0-.57-.35-.91-.34-.34-.89-.34-.38 0-.68.17a1.2 1.2 0 0 0-.48.51q-.18.33-.18.81V17zm-5.18.15q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49q1.13 0 1.96.49t1.29 1.39q.45.89.45 2.07t-.45 2.07-1.28 1.38-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M30.97 17V6.81h1.96v4.16h4.58V6.81h1.97V17h-1.97v-4.39h-4.58V17z"/>
</svg>
`;

/**
 * __HomeLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function HomeLogo({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Home'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
