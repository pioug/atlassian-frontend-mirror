/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

import { PrimaryButton } from '../PrimaryButton';

import { type PrimaryDropdownButtonProps } from './types';

const buttonNoOpStyle = css({
	'--noop': 1,
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
export const PrimaryDropdownButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<PrimaryDropdownButtonProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, PrimaryDropdownButtonProps>(
	(props: PrimaryDropdownButtonProps, ref: Ref<HTMLElement>) => {
		const { component, isHighlighted, isLoading, onClick, testId, theme, tooltip, ...rest } = props;
		return (
			<PrimaryButton
				component={component}
				iconAfter={<ChevronDownIcon color="currentColor" label="" size="small" />}
				isHighlighted={isHighlighted}
				isLoading={isLoading}
				onClick={onClick}
				ref={ref}
				testId={testId}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				theme={theme}
				tooltip={tooltip}
				css={[buttonNoOpStyle] as any} // Typescript working for css mismatch error
				// These are all explicit, leaving it in just in case
				{...rest}
			/>
		);
	},
);
