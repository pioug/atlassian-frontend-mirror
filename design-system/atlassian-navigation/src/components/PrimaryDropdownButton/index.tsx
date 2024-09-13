/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ChevronIconOld from '@atlaskit/icon/glyph/chevron-down';
import ChevronIcon from '@atlaskit/icon/utility/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
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
			<PrimaryButton
				iconAfter={
					fg('platform-component-visual-refresh') ? (
						<ChevronIcon label="" color="currentColor" />
					) : (
						<Bleed xcss={chevronIconStylesWithSpacingFixStyles} inline="space.100">
							<ChevronIconOld label="" />
						</Bleed>
					)
				}
				ref={ref}
				{...props}
			/>
		);
	},
);

export default PrimaryDropdownButton;
