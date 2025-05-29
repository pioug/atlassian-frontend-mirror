/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fdb285c22ea2d78f30f8b22d7db6a9d6>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 64 24">
    <path fill="var(--tile-color,#1868db)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, white)" d="M11.057 5.257a1.57 1.57 0 0 1 1.539.015l4.621 2.668c.484.279.783.797.783 1.354v5.336a1.56 1.56 0 0 1-.782 1.355l-3.474 2.005a2 2 0 0 0 .12-.691v-5.337c0-.733-.39-1.409-1.026-1.774l-2.59-1.495V6.626q.001-.246.074-.473c.117-.364.366-.68.707-.877z"/>
    <path fill="var(--icon-color, white)" d="M9.881 5.94 6.408 7.945A1.56 1.56 0 0 0 5.625 9.3v5.337c0 .557.3 1.075.783 1.354l4.621 2.668c.475.274 1.06.279 1.539.015l.027-.019a1.57 1.57 0 0 0 .781-1.35v-2.067l-2.589-1.495a2.05 2.05 0 0 1-1.026-1.775V6.631a2 2 0 0 1 .12-.691"/>
    <path fill="var(--text-color, #292a2e)" d="M59.63 17.15q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49q1.13 0 1.96.49t1.29 1.39q.45.89.45 2.07t-.45 2.07-1.28 1.38-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M50.36 17l-2.83-7.64h2.04l1.34 4.05q.24.74.41 1.49l.37 1.54h-.44q.19-.79.36-1.54t.41-1.49l1.33-4.05h2.02L52.54 17zm-7.08.15q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49 1.96.49q.83.49 1.29 1.39.45.89.45 2.07t-.45 2.07-1.29 1.38q-.83.49-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87t.19-1.23-.19-1.23a1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M30.97 17V6.81h3.9q1.16 0 1.97.41t1.22 1.16q.42.74.42 1.72 0 .99-.42 1.72t-1.25 1.12q-.81.38-1.99.38h-2.7v-1.61h2.41q.66 0 1.09-.18t.63-.54q.21-.36.21-.88 0-.53-.21-.89a1.34 1.34 0 0 0-.64-.57q-.42-.2-1.09-.2h-1.6V17zm5.7 0-2.47-4.63h2.14L38.85 17z"/>
</svg>
`;

/**
 * __RovoLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function RovoLogo({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Rovo'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
