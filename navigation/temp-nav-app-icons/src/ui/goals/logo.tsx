/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::124dbfd7762d4a34e638bd989b6b32d6>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { LogoWrapper } from '../../utils/logo-wrapper';
import type { AppLogoProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg width="70" viewBox="0 0 70 24">
    <path fill="#dddee1" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="#101214" d="M14.52 12a2.52 2.52 0 1 1-5.04 0 2.52 2.52 0 0 1 5.04 0"/>
    <path fill="#101214" fill-rule="evenodd" d="M12 19.031A7.031 7.031 0 1 0 12 4.97a7.031 7.031 0 0 0 0 14.062M16.395 12a4.395 4.395 0 1 1-8.79 0 4.395 4.395 0 0 1 8.79 0" clip-rule="evenodd"/>
    <path fill="var(--ds-text, #292a2e)" d="M65.94 17.15q-.9 0-1.6-.25a2.84 2.84 0 0 1-1.14-.75 2.5 2.5 0 0 1-.57-1.2l1.8-.32q.15.55.54.82t1.02.27q.62 0 .98-.24t.36-.61q0-.31-.25-.51t-.76-.31l-1.31-.27q-1.09-.23-1.63-.77t-.54-1.39q0-.72.4-1.24.4-.53 1.1-.81.71-.29 1.65-.29.89 0 1.53.25.65.25 1.05.7.4.44.55 1.06l-1.71.31a1.3 1.3 0 0 0-.46-.66q-.34-.27-.92-.27-.53 0-.9.23-.35.23-.35.6 0 .32.23.52.24.2.8.33l1.34.27q1.09.23 1.63.74t.54 1.33q0 .74-.43 1.3-.43.55-1.19.87-.75.31-1.74.31m-5.06-.12q-1.12 0-1.65-.5t-.53-1.49V6.82h1.93v7.96q0 .39.12.57.13.17.45.17.17 0 .26-.01.1-.01.17-.03l.31 1.42q-.16.06-.44.11a3.5 3.5 0 0 1-.61.05m-8.19.07a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.13-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17H55v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.55 0 .94-.3.38-.3.58-.84.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83q-.38-.29-.94-.29-.57 0-.96.3a1.85 1.85 0 0 0-.58.83 3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31m-8.57 1.58q-1.13 0-1.97-.49a3.3 3.3 0 0 1-1.28-1.38q-.45-.89-.45-2.06 0-1.18.45-2.07.45-.9 1.28-1.39t1.97-.49 1.96.49q.83.49 1.29 1.39.45.89.45 2.07t-.45 2.07-1.28 1.38-1.96.49m0-1.53q.58 0 .97-.31.39-.32.58-.87a3.7 3.7 0 0 0 .19-1.23 3.7 3.7 0 0 0-.19-1.23 1.87 1.87 0 0 0-.58-.86q-.39-.32-.97-.32t-.97.32q-.38.32-.58.86-.19.54-.19 1.23 0 .68.19 1.23.2.55.58.87.39.31.97.31m-9.53 1.51q-1.29 0-2.32-.64-1.02-.63-1.63-1.8-.6-1.17-.6-2.77 0-1.65.62-2.82t1.68-1.8q1.07-.63 2.41-.63.85 0 1.58.25.74.25 1.31.7.57.46.94 1.09a3.8 3.8 0 0 1 .49 1.37h-2.01a2.3 2.3 0 0 0-.32-.69 2 2 0 0 0-.5-.52 2 2 0 0 0-.66-.33 2.6 2.6 0 0 0-.81-.12q-.81 0-1.43.4T33 10.01q-.35.77-.35 1.89 0 1.11.35 1.89t.98 1.19q.64.4 1.48.4.76 0 1.3-.29a2 2 0 0 0 .83-.83q.29-.55.29-1.29h.42v.85q0 .66-.16 1.26t-.53 1.06q-.35.47-.95.73-.59.27-1.45.27m3.24-.14-.26-2.43v-1.43H35.6v-1.52h4.19V17z"/>
</svg>
`;

/**
 * __GoalsLogo__
 *
 * Note: This component is a temporary solution for use in certain navigation elements for Team '25, until
 * the new language is incoporated into `@atlaskit/logo`.
 *
 * If you are using this component at scale, please reach out to Design System Team so we can assist.
 */
export function GoalsLogo({ label, testId }: AppLogoProps) {
	return <LogoWrapper svg={svg} label={label || 'Goals'} testId={testId} />;
}
