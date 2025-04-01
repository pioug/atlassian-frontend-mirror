/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a317ffc161852a8de1739cb917f0448f>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="69" viewBox="0 0 69 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M19.438 11.173h-4.35l3.767-2.175-.827-1.433L14.26 9.74l2.174-3.767-1.433-.828-2.175 3.767v-4.35h-1.654v4.35L8.997 5.145l-1.432.827L9.739 9.74 5.972 7.565l-.827 1.433 3.767 2.175h-4.35v1.654h4.35l-3.767 2.175.827 1.433 3.767-2.174-2.175 3.767 1.433.827 2.175-3.767v4.35h1.655v-4.35L15 18.855l1.434-.828-2.175-3.767 3.767 2.175.827-1.433-3.767-2.174h4.35v-1.655M12 14.25a2.259 2.259 0 1 1 0-4.517 2.259 2.259 0 0 1 0 4.517"/>
    <path fill="var(--ds-text, #292a2e)" d="M56.94 17V9.36h1.8l.08 1.87h-.14q.17-.7.51-1.13.35-.44.81-.64.47-.21.97-.21.83 0 1.33.52.51.52.73 1.57h-.22q.16-.71.55-1.18.39-.46.91-.69.53-.23 1.12-.23.69 0 1.24.3t.87.88.32 1.42V17H65.9v-4.82q0-.67-.37-1a1.32 1.32 0 0 0-.89-.32q-.4 0-.7.18a1.2 1.2 0 0 0-.46.49q-.16.32-.16.73V17h-1.87v-4.89q0-.57-.35-.91-.34-.34-.89-.34-.38 0-.68.17a1.2 1.2 0 0 0-.48.51q-.18.33-.18.81V17zm-5.19.15q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49q1.13 0 1.96.49T55 11.15q.45.89.45 2.07T55 15.29t-1.28 1.38-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31m-8.56 1.52q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49 1.96.49q.83.49 1.29 1.39.45.89.45 2.07t-.45 2.07-1.28 1.38-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M31.97 17V6.81h1.96v8.55h4.44V17z"/>
</svg>
`;

/**
 * __LoomLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function LoomLogo({ label, testId }: AppLogoProps) {
	return <LogoWrapper svg={svg} label={label || 'Loom'} testId={testId} />;
}
