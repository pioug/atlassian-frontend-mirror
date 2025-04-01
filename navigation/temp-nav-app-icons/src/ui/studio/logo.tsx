/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::566a03a22aaf2da01ede93b06b0df3de>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="75" viewBox="0 0 75 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M10.594 10.594v7.969h7.969v-7.97z"/>
    <path fill="#101214" d="M14.813 7.195 10.125 4.5 5.438 7.195v5.39l3.75 2.157V9.187h5.625z"/>
    <path fill="var(--ds-text, #292a2e)" d="M69.65 17.15q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49 1.96.49q.83.49 1.29 1.39.45.89.45 2.07t-.45 2.07-1.29 1.38q-.83.49-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31M62.54 17V9.36h1.93V17zm-.02-8.73V6.52h1.98v1.75zm-5.96 8.86a2.9 2.9 0 0 1-1.6-.46q-.71-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.13-1.32a2.9 2.9 0 0 1 1.57-.44q.66 0 1.09.23.43.22.69.54.27.32.4.61h.07V6.81h1.92V17h-1.89v-1.22h-.1a2.8 2.8 0 0 1-.4.61q-.27.31-.7.53-.43.21-1.07.21m.56-1.55q.55 0 .94-.3.38-.3.58-.84a3.5 3.5 0 0 0 .21-1.25q0-.72-.2-1.25t-.59-.83q-.38-.29-.94-.29-.57 0-.95.31a1.85 1.85 0 0 0-.58.83 3.6 3.6 0 0 0-.19 1.22q0 .69.19 1.23.2.54.58.85.39.31.95.31m-9.39 1.53q-.79 0-1.39-.34a2.34 2.34 0 0 1-.92-.98q-.33-.65-.33-1.55V9.37h1.93v4.54q0 .75.38 1.16.38.42 1.05.42.46 0 .81-.19.35-.2.55-.57.2-.38.2-.9V9.38h1.93V17h-1.83l-.02-1.9h.12q-.31.98-.93 1.49t-1.56.51m-3.99-7.74v1.48h-4.44V9.36zm-3.38-1.82h1.92v7.27q0 .38.17.57t.56.19q.12 0 .32-.03.21-.03.32-.06l.29 1.46q-.31.1-.64.13a5 5 0 0 1-.62.04q-1.13 0-1.73-.55-.59-.56-.59-1.59zm-5.72 9.61q-1.2 0-2.09-.37t-1.39-1.09q-.5-.73-.53-1.77h1.92q.04.53.32.88t.74.53q.46.17 1.02.17.57 0 1.01-.17.44-.18.68-.49.25-.31.25-.72a.9.9 0 0 0-.22-.62 1.7 1.7 0 0 0-.62-.42 5.3 5.3 0 0 0-.96-.31l-1.13-.29q-1.28-.32-2.01-.99-.72-.67-.72-1.76 0-.91.49-1.59t1.35-1.06 1.94-.38q1.11 0 1.94.38t1.3 1.06q.47.67.49 1.54h-1.9q-.06-.64-.55-.98-.49-.35-1.29-.35a2.5 2.5 0 0 0-.94.17q-.39.16-.6.44a1.06 1.06 0 0 0-.2.64q0 .4.24.66.25.26.63.42.39.16.81.26l.94.23q.61.14 1.15.38.55.24.97.6.42.35.66.84t.24 1.14q0 .91-.46 1.59t-1.33 1.06-2.1.38"/>
</svg>
`;

/**
 * __StudioLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function StudioLogo({ label, testId }: AppLogoProps) {
	return <LogoWrapper svg={svg} label={label || 'Studio'} testId={testId} />;
}
