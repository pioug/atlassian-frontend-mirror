/** @jsx jsx */
import { forwardRef, type Ref } from 'react';

import { jsx } from '@emotion/react';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { Bleed, xcss } from '@atlaskit/primitives';

import { PrimaryButton } from '../PrimaryButton';

import { type PrimaryDropdownButtonProps } from './types';

const chevronIconStylesWithSpacingFixStyles = xcss({
	marginInlineEnd: 'space.negative.050',
});

/**
 * __Primary dropdown button__
 *
 * A primary dropdown button allows you to add dropdown menus to the navigation.
 * Should be passed into `AtlassianNavigation`'s `primaryItems` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const PrimaryDropdownButton = forwardRef<HTMLElement, PrimaryDropdownButtonProps>(
	(props: PrimaryDropdownButtonProps, ref: Ref<HTMLElement>) => {
		return (
			// @ts-ignore - This was added when `@atlaskit/page-layout` was enrolled into JFE local consumption
			// There seems to be an incompatibility in the `css` prop between jira and platform
			// The error goes away when we remove the spread ...props
			<PrimaryButton
				iconAfter={
					<Bleed xcss={chevronIconStylesWithSpacingFixStyles} inline="space.100">
						<ChevronIcon label="" />
					</Bleed>
				}
				ref={ref}
				{...props}
			/>
		);
	},
);

export default PrimaryDropdownButton;
