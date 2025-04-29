/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ChevronIconMigration from '@atlaskit/icon/utility/migration/chevron-down';
import { token } from '@atlaskit/tokens';

import { PrimaryButton } from '../PrimaryButton';

import { type PrimaryDropdownButtonProps } from './types';

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
		const { component, isHighlighted, isLoading, onClick, testId, theme, tooltip, ...rest } = props;
		return (
			<PrimaryButton
				component={component}
				iconAfter={
					<ChevronIconMigration
						LEGACY_margin={`0 ${token('space.negative.050')} 0 ${token('space.negative.100')}`}
						color="currentColor"
						label=""
					/>
				}
				isHighlighted={isHighlighted}
				isLoading={isLoading}
				onClick={onClick}
				ref={ref}
				testId={testId}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				theme={theme}
				tooltip={tooltip}
				// These are mostly explicit, leaving it in just in case
				{...rest}
			/>
		);
	},
);
