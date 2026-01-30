/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ae52a924e4e7dfd935c84ea07ee923b8>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 72 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M20.84 12.21a4.29 4.29 0 0 0-6.05 0l-1.394 1.393c-.77.769-2.02.769-2.789 0L9.45 12.445 6.424 15.47l1.158 1.158a6.25 6.25 0 0 0 8.838 0zm-17.68-.418a4.253 4.253 0 0 0 6.034.017l1.412-1.412a1.973 1.973 0 0 1 2.788 0l1.158 1.158 3.026-3.025-1.158-1.158a6.25 6.25 0 0 0-8.838 0l-4.42 4.419z"/>
    <path fill="var(--text-color, #292a2e)" d="M68.08 17.15q-.9 0-1.6-.25a2.84 2.84 0 0 1-1.14-.75 2.5 2.5 0 0 1-.57-1.2l1.8-.32q.15.55.54.82t1.03.27q.62 0 .98-.24t.36-.61q0-.31-.25-.51t-.76-.31l-1.31-.27q-1.09-.23-1.63-.77t-.54-1.39q0-.72.4-1.24.4-.53 1.1-.81.71-.29 1.65-.29.89 0 1.53.25.65.25 1.05.7.4.44.55 1.06l-1.71.31a1.3 1.3 0 0 0-.46-.66q-.33-.27-.92-.27-.53 0-.89.23t-.36.6q0 .32.23.52.24.2.8.33l1.34.27q1.09.23 1.63.74t.54 1.33q0 .74-.43 1.3-.43.55-1.19.87-.75.31-1.74.31m-9.02-.07q-.79 0-1.39-.34a2.34 2.34 0 0 1-.92-.98q-.33-.65-.33-1.55V9.37h1.93v4.54q0 .75.38 1.16t1.05.42q.46 0 .81-.19.35-.2.55-.57.2-.38.2-.9V9.38h1.93V17h-1.82l-.02-1.9h.12q-.31.98-.93 1.49t-1.56.51m-7.47.05q-1.13 0-1.96-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.96-.49q.66 0 1.22.17t1 .49.72.78q.29.46.41 1.03l-1.8.36q-.06-.3-.2-.54a1.5 1.5 0 0 0-.33-.4 1.3 1.3 0 0 0-.44-.26 1.6 1.6 0 0 0-.56-.09q-.58 0-.97.31t-.59.86q-.2.54-.2 1.24t.2 1.24.59.86.97.31q.32 0 .57-.09.26-.09.46-.27a1.6 1.6 0 0 0 .34-.42q.14-.25.2-.56l1.79.35q-.12.6-.4 1.06a2.8 2.8 0 0 1-.73.79 3.3 3.3 0 0 1-1 .51q-.56.17-1.23.17m-8.57-.02q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49q1.13 0 1.96.49t1.29 1.39q.45.89.45 2.07t-.45 2.07a3.3 3.3 0 0 1-1.29 1.38q-.83.49-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M31.97 17V6.81h6.62v1.64h-4.65v2.95h4.2v1.61h-4.2V17z"/>
</svg>
`;

/**
 * __FocusLogo__
 *
 * A temporary component to represent the logo for Focus.
 *
 */
export function FocusLogo({
	size,
	appearance = 'brand',
	label = 'Focus',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
