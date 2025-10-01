/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9426336994e9e135b11ddf2bec113b65>>
 * @codegenCommand yarn workspace @atlaskit/temp-nav-app-icons build-temp-logos
 */
import React from 'react';

import { IconWrapper } from '../../utils/icon-wrapper';
import type { AppIconProps } from '../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--rovo-blue-color, #1868db)" fill-rule="evenodd" d="m13.227 16.789-7.154 4.169-3.403-1.96a2.72 2.72 0 0 1-1.362-2.355V7.366c0-.973.518-1.87 1.361-2.354l6.044-3.487-.038.114a3.6 3.6 0 0 0-.172 1.088v9.278c0 1.274.68 2.45 1.786 3.085z" clip-rule="evenodd"/>
    <path fill="var(--rovo-green-color, #6a9a23)" fill-rule="evenodd" d="m11.296 15.671-7.193 4.153 6.607 3.812a2.73 2.73 0 0 0 2.676.026l.048-.033a2.73 2.73 0 0 0 1.232-1.525 2.7 2.7 0 0 0 .127-.822v-3.594z" clip-rule="evenodd"/>
    <path fill="var(--rovo-purple-color, #af59e1)" fill-rule="evenodd" d="m21.477 5.003-4.404-2.539-5.904 4.89 2.69 1.556a3.56 3.56 0 0 1 1.785 3.086v9.277a3.6 3.6 0 0 1-.21 1.202l6.044-3.486a2.71 2.71 0 0 0 1.362-2.355V7.357c0-.97-.521-1.87-1.363-2.354" clip-rule="evenodd"/>
    <path fill="var(--rovo-yellow-color, #fca700)" fill-rule="evenodd" d="M12.74 8.266 9.353 6.312V2.718c0-.283.044-.56.127-.821A2.73 2.73 0 0 1 10.71.372V.37a.4.4 0 0 0 .048-.033 2.73 2.73 0 0 1 2.676.026l6.499 3.75z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __RovoHexIcon__
 *
 * A temporary component to represent the icon for Rovo.
 * @deprecated This component has been replaced by the component `RovoHexIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function RovoHexIcon({ size, appearance = 'brand', label = 'Rovo', testId }: AppIconProps) {
	return (
		<IconWrapper
			svg={svg}
			label={label}
			type="rovo"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
