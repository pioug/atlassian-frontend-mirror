/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d551593b8677ea578dab8c3272c8e061>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 73 24">
    <path fill="var(--tile-color,#fb9700)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="m9.297 8.753 2.277-5.073h.858l2.277 5.073 5.529.598.265.816-4.121 3.734 1.14 5.442-.695.505-4.824-2.766-4.824 2.766-.695-.505 1.14-5.442-4.121-3.733.265-.817zm.777 6.415v-.678a1.857 1.857 0 0 1 3.715 0v.613a3.6 3.6 0 0 1-1.886.548h-.053a3.6 3.6 0 0 1-1.776-.483m1.858-3.134a1.393 1.393 0 1 0 0-2.786 1.393 1.393 0 0 0 0 2.786" clip-rule="evenodd"/>
    <path fill="var(--text-color, #292a2e)" d="M72.52 9.36v1.48h-4.44V9.36zm-3.38-1.82h1.92v7.27q0 .38.17.57t.56.19q.12 0 .32-.03.21-.03.32-.06l.29 1.46q-.31.1-.64.13a5 5 0 0 1-.62.04q-1.13 0-1.73-.55-.59-.56-.59-1.59zm-7.02 5.01V17h-1.93V9.36h1.82l.03 1.9h-.13q.31-.97.92-1.48.62-.51 1.57-.51.79 0 1.37.34.6.34.92.98.33.64.33 1.55V17H65.1v-4.54q0-.74-.38-1.16t-1.05-.42q-.45 0-.81.2a1.34 1.34 0 0 0-.55.57q-.2.37-.2.9m-6.81 4.6q-1.16 0-2-.48a3.25 3.25 0 0 1-1.29-1.37q-.45-.88-.45-2.08 0-1.18.44-2.06a3.4 3.4 0 0 1 1.26-1.39q.82-.5 1.93-.5.73 0 1.36.23.64.23 1.14.71.49.47.77 1.2t.28 1.72v.57H52.4v-1.25h5.39l-.9.35a2.8 2.8 0 0 0-.19-1.08 1.55 1.55 0 0 0-.57-.72q-.37-.26-.93-.26-.55 0-.94.26t-.59.7-.2.99v.88q0 .69.23 1.17.24.47.66.71t.98.24q.37 0 .68-.11t.53-.31a1.4 1.4 0 0 0 .34-.52l1.75.34q-.18.62-.64 1.09-.45.46-1.13.73-.68.25-1.54.25m-5.25-.11q-1.12 0-1.65-.5t-.53-1.49V6.82h1.93v7.96q0 .39.12.57.13.17.45.17.17 0 .26-.01.1-.01.16-.03l.32 1.42q-.16.06-.44.11a3.5 3.5 0 0 1-.61.05m-8.18.07a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17h-1.9v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.56 0 .94-.3t.58-.84q.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83-.94-.29q-.57 0-.96.3a1.85 1.85 0 0 0-.58.83 3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31M30.54 8.46V6.82h8.22v1.64h-3.12V17h-1.97V8.46z"/>
</svg>
`;

/**
 * __TalentLogo__
 *
 * A temporary component to represent the logo for Talent.
 *
 */
export function TalentLogo({
	size,
	appearance = 'brand',
	label = 'Talent',
	testId,
}: AppLogoProps): React.JSX.Element {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
