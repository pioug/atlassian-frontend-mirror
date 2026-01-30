/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5b3684e2355c28ec62827d09d362b6cf>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 25 24">
    <path fill="var(--tile-color, white)" d="M6.417.5h12a5.5 5.5 0 0 1 5.5 5.5v12a5.5 5.5 0 0 1-5.5 5.5h-12a5.5 5.5 0 0 1-5.5-5.5V6a5.5 5.5 0 0 1 5.5-5.5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6.417.5h12a5.5 5.5 0 0 1 5.5 5.5v12a5.5 5.5 0 0 1-5.5 5.5h-12a5.5 5.5 0 0 1-5.5-5.5V6a5.5 5.5 0 0 1 5.5-5.5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M14.117 10.203h4.464c.67 0 .899.637.49 1.144l-6.98 8.616c-2.257-1.798-2.044-4.643-.393-6.72zm-3.45 3.433H6.205c-.67 0-.899-.638-.49-1.144l6.981-8.617c2.256 1.799 2.011 4.61.376 6.704z"/>
</svg>
`;

/**
 * __JiraServiceManagementDataCenterIcon__
 *
 * A temporary component to represent the icon for Jira Service Management Data Center.
 * @deprecated This component has been replaced by the component `JiraServiceManagementDataCenterIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function JiraServiceManagementDataCenterIcon({
	size,
	appearance = 'brand',
	label = 'Jira Service Management Data Center',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper
			svg={svg}
			label={label}
			type="data-center"
			appearance={appearance}
			size={size}
			testId={testId}
		/>
	);
}
