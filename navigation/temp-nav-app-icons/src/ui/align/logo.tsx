/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5ce1673a12bf72dc5687cdad1fe67c40>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="66" viewBox="0 0 66 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M18.545 18.545a4.49 4.49 0 0 0-4.48-4.48h-4.13v-3.78h-4.48v7.434c0 .576.25.826.826.826zM5.455 5.455a4.454 4.454 0 0 0 4.455 4.48h4.155v3.78h4.48V6.28q0-.825-.826-.826z"/>
    <path fill="var(--ds-text, #292a2e)" d="M59.96 12.55V17h-1.93V9.36h1.82l.03 1.9h-.13q.31-.97.92-1.48.62-.51 1.57-.51.79 0 1.37.34.6.34.92.98.33.64.33 1.55V17h-1.92v-4.54q0-.74-.38-1.16t-1.05-.42q-.45 0-.81.2a1.34 1.34 0 0 0-.55.57q-.2.37-.2.9m-7.38 7.47q-.94 0-1.63-.24-.69-.23-1.13-.65a2.3 2.3 0 0 1-.62-.94l1.64-.51q.11.21.32.42.2.21.55.35t.87.14q.81 0 1.28-.38.47-.37.47-1.16v-1.41h-.15q-.14.29-.4.58-.25.29-.68.48-.42.19-1.07.19a3.1 3.1 0 0 1-1.58-.41q-.7-.41-1.13-1.24-.42-.83-.42-2.08 0-1.28.42-2.15t1.14-1.31a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.44.22.7.54.27.32.4.61h.09V9.36h1.89v7.62q0 1.02-.47 1.7-.46.68-1.29 1-.82.33-1.88.33m.04-4.61q.55 0 .94-.27.38-.27.58-.77.21-.5.21-1.21 0-.7-.2-1.22-.2-.53-.58-.81-.38-.29-.94-.29-.57 0-.96.3-.38.3-.58.83a3.5 3.5 0 0 0-.19 1.2q0 .68.2 1.19t.58.79q.39.27.95.27M45.49 17V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-2.04 8.78q-1.12 0-1.65-.5t-.53-1.49V6.82h1.93v7.96q0 .39.12.57.13.17.45.17.17 0 .26-.01.1-.01.16-.03l.31 1.42q-.16.06-.44.11a3.5 3.5 0 0 1-.61.05M30.34 17l3.52-10.19h2.54L39.99 17h-2.17l-1.71-5.09a58 58 0 0 1-.58-1.97q-.29-1.09-.63-2.41h.42a546 546 0 0 1-.62 2.43q-.28 1.09-.55 1.96L32.49 17zm2.13-2.44V13h5.4v1.56z"/>
</svg>
`;

/**
 * __AlignLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function AlignLogo({ label, testId }: AppLogoProps) {
	return <LogoWrapper svg={svg} label={label || 'Align'} testId={testId} />;
}
