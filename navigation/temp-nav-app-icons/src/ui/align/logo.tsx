/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2940410803267fb31f7775bbe29a3adc>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="67" viewBox="0 0 67 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" d="M17.801 17.801a3.98 3.98 0 0 0-3.97-3.97H10.17v-3.35H6.199v6.588c0 .51.222.732.732.732zM6.2 6.2a3.95 3.95 0 0 0 3.949 3.97h3.682v3.35h3.971V6.932q0-.732-.732-.732z"/>
    <path fill="var(--ds-text, #292a2e)" d="M60.28 12.55V17h-1.93V9.36h1.82l.03 1.9h-.13q.31-.97.92-1.48.62-.51 1.57-.51.79 0 1.37.34.6.34.92.98.33.64.33 1.55V17h-1.92v-4.54q0-.74-.38-1.16t-1.05-.42q-.45 0-.81.2a1.34 1.34 0 0 0-.55.57q-.2.37-.2.9m-7.37 7.47q-.94 0-1.63-.24-.69-.23-1.13-.65a2.3 2.3 0 0 1-.61-.94l1.64-.51q.11.21.32.42.2.21.55.35t.87.14q.81 0 1.28-.38.47-.37.47-1.16v-1.41h-.15q-.14.29-.4.58a2 2 0 0 1-.68.48q-.42.19-1.07.19a3.1 3.1 0 0 1-1.58-.41q-.7-.41-1.13-1.24-.42-.83-.42-2.08 0-1.28.42-2.15t1.14-1.31a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.44.22.7.54.27.32.4.61h.09V9.36h1.89v7.62q0 1.02-.47 1.7-.46.68-1.29 1-.82.33-1.88.33m.03-4.62q.55 0 .94-.27.38-.27.58-.77.21-.5.21-1.21 0-.7-.2-1.22-.2-.53-.58-.81-.38-.29-.94-.29-.57 0-.96.3-.38.3-.58.83a3.5 3.5 0 0 0-.19 1.2q0 .68.2 1.19t.58.79q.39.27.95.27M45.81 17V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-2.04 8.78q-1.12 0-1.65-.5t-.53-1.49V6.82h1.93v7.96q0 .39.12.57.13.17.45.17.17 0 .26-.01.1-.01.16-.03l.32 1.42q-.16.06-.44.11a3.5 3.5 0 0 1-.61.05M30.66 17l3.52-10.19h2.54L40.32 17h-2.17l-1.72-5.09a58 58 0 0 1-.58-1.97 212 212 0 0 1-.64-2.41h.42a531 531 0 0 1-.61 2.43 44 44 0 0 1-.55 1.96L32.82 17zm2.13-2.44V13h5.4v1.56z"/>
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
