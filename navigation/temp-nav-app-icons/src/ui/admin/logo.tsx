/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::dbd3100f177423e11635035a73f7cea5>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 73 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M10.444 5h3.111l.98 2.61 2.75-.457 1.555 2.694L17.07 12l1.77 2.153-1.555 2.694-2.75-.457-.979 2.61h-3.11l-.98-2.61-2.75.457-1.555-2.694L6.931 12 5.16 9.847l1.555-2.694 2.75.457zM12 14.625a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25" clip-rule="evenodd"/>
    <path fill="var(--text-color, #292a2e)" d="M67.12 12.55V17h-1.93V9.36h1.82l.03 1.9h-.13q.31-.97.92-1.48.62-.51 1.57-.51.79 0 1.37.34.6.34.92.98.33.64.33 1.55V17H70.1v-4.54q0-.74-.38-1.16t-1.05-.42q-.45 0-.81.2a1.34 1.34 0 0 0-.55.57q-.2.37-.2.9M61.46 17V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zM48.76 17V9.36h1.8l.08 1.87h-.14q.17-.7.51-1.13.35-.44.81-.64.47-.21.97-.21.83 0 1.33.52.51.52.73 1.57h-.22q.16-.71.55-1.18.39-.46.91-.69.53-.23 1.12-.23.69 0 1.24.3.56.3.87.88.32.58.32 1.42V17h-1.92v-4.82q0-.67-.37-1a1.32 1.32 0 0 0-.89-.32q-.4 0-.7.18a1.2 1.2 0 0 0-.46.49q-.16.32-.16.73V17h-1.87v-4.89q0-.57-.35-.91-.34-.34-.89-.34-.37 0-.68.17a1.2 1.2 0 0 0-.49.51q-.18.33-.18.81V17zm-5.99.13a2.9 2.9 0 0 1-1.6-.46q-.71-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.57-.44q.66 0 1.09.23.43.22.69.54.27.32.4.61h.07V6.81h1.92V17h-1.89v-1.22h-.1a2.8 2.8 0 0 1-.4.61q-.27.31-.7.53-.43.21-1.07.21m.56-1.55q.55 0 .94-.3.38-.3.58-.84a3.5 3.5 0 0 0 .21-1.25q0-.72-.2-1.25t-.59-.83q-.38-.29-.94-.29-.57 0-.95.31a1.85 1.85 0 0 0-.58.83 3.6 3.6 0 0 0-.19 1.22q0 .69.19 1.23.2.54.58.85.39.31.95.31m-14 1.43 3.52-10.19h2.54L38.99 17h-2.17l-1.71-5.09a58 58 0 0 1-.58-1.97q-.29-1.09-.63-2.41h.42a546 546 0 0 1-.62 2.43q-.28 1.09-.55 1.96L31.5 17zm2.13-2.44V13h5.4v1.56z"/>
</svg>
`;

/**
 * __AdminLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AdminLogo({ size, appearance = 'brand', label, testId }: AppLogoProps) {
	return (
		<LogoWrapper
			svg={svg}
			label={label || 'Admin'}
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
