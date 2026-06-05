/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a4a56eeee9c8594a65687d2ede86d87f>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 55 55">
    <path fill="var(--tile-color,#1868db)" d="M24.519.844a6.3 6.3 0 0 1 6.3 0l18.37 10.601a6.3 6.3 0 0 1 3.15 5.454V38.1c0 2.25-1.2 4.33-3.15 5.454l-18.37 10.601a6.3 6.3 0 0 1-6.3 0l-18.37-10.6a6.3 6.3 0 0 1-3.15-5.454V16.9c0-2.25 1.2-4.33 3.15-5.454z"/>
    <path fill="var(--icon-color, white)" d="M20.71 34.657h-2.705C13.926 34.657 11 32.16 11 28.5h14.543c.754 0 1.241.536 1.241 1.294v14.634c-3.635 0-6.074-2.944-6.074-7.05zm7.183-7.272h-2.705c-4.079 0-7.005-2.454-7.005-6.113h14.542c.754 0 1.286.491 1.286 1.25v14.634c-3.635 0-6.118-2.945-6.118-7.05zm7.227-7.228h-2.705c-4.079 0-7.005-2.498-7.005-6.157h14.543c.753 0 1.241.535 1.241 1.25v14.633c-3.636 0-6.074-2.944-6.074-7.049z"/>
</svg>
`;

/**
 * __JiraCodingAgentIcon__
 *
 * A temporary component to represent the icon for Jira Coding Agent.
 * @deprecated This component has been replaced by the component `JiraCodingAgentIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function JiraCodingAgentIcon({
	size,
	appearance = 'brand',
	label = 'Jira Coding Agent',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
