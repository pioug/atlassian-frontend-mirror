/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::daf8acf7c1707ab5f837689f4e92f4a5>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color, white)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5"/>
    <path fill="none" stroke="var(--border-color, #dddee1)" d="M6 .5h12A5.5 5.5 0 0 1 23.5 6v12a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 18V6A5.5 5.5 0 0 1 6 .5Z"/>
    <path fill="var(--icon-color, #1868db)" d="M17.37 14.265c-3.704-1.79-4.785-2.058-6.346-2.058-1.83 0-3.391.761-4.785 2.902l-.229.35c-.187.288-.229.39-.229.514s.063.227.292.37l2.35 1.462c.125.083.23.124.333.124.125 0 .208-.062.333-.247l.375-.577c.582-.885 1.102-1.173 1.768-1.173.583 0 1.27.165 2.122.577l2.455 1.152c.25.124.52.062.645-.226l1.165-2.552c.125-.289.042-.474-.25-.618M6.572 9.757c3.703 1.791 4.785 2.059 6.346 2.059 1.83 0 3.39-.762 4.785-2.902l.229-.35c.187-.288.228-.391.228-.515 0-.123-.062-.226-.29-.37l-2.352-1.462c-.125-.082-.229-.123-.333-.123-.125 0-.208.061-.333.247l-.374.576c-.583.885-1.103 1.173-1.769 1.173-.582 0-1.269-.164-2.122-.576L8.132 6.361c-.25-.123-.52-.061-.645.227L6.322 9.14c-.125.288-.041.473.25.617"/>
</svg>
`;

/**
 * __ConfluenceDataCenterIcon__
 *
 * A temporary component to represent the icon for Confluence Data Center.
 * @deprecated This component has been replaced by the component `ConfluenceDataCenterIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function ConfluenceDataCenterIcon({
	size,
	appearance = 'brand',
	label = 'Confluence Data Center',
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
