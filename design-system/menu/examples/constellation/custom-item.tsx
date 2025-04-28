/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { MouseEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { Box } from '@atlaskit/primitives';
import { B100 } from '@atlaskit/theme/colors';

import { type CSSFn, CustomItem, type CustomItemComponentProps } from '../../src';
import Slack from '../icons/slack';

type CustomComponentWithHrefProps = CustomItemComponentProps & {
	href: string;
};

const CustomComponent = ({ children, href, ...props }: CustomComponentWithHrefProps) => {
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<a href={href} {...props}>
			{children}
		</a>
	);
};

const cssFn: CSSFn = (state) => {
	return {
		position: 'relative',
		overflow: 'hidden',
		userSelect: 'none',
		'::before': state.isDisabled
			? {}
			: {
					content: '""',
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: 3,
					transform: 'translateX(-1px)',
					transition: 'transform 70ms ease-in-out',

					backgroundColor: B100,
				},

		':hover::before': state.isDisabled
			? {}
			: {
					transform: 'translateX(0)',
				},
	};
};

export default () => (
	/**
	 * It is not normally acceptable to add click handlers to non-interactive elements
	 * as this is an accessibility anti-pattern. However, because this instance is
	 * for performance reasons (to avoid multiple click handlers) and not creating an
	 * inaccessible custom element, we can add role="presentation" so that there is
	 * no negative impacts to assistive technologies.
	 */
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
	<Box onClick={(e: MouseEvent) => e.preventDefault()} role="presentation">
		<CustomItem
			href="/navigation-system"
			component={CustomComponent}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={cssFn}
		>
			Navigation System
		</CustomItem>
		<CustomItem
			href="/navigation-system-1"
			isSelected
			component={CustomComponent}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={cssFn}
		>
			Navigation System
		</CustomItem>
		<CustomItem
			href="/navigation-system-2"
			isDisabled
			component={CustomComponent}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={cssFn}
		>
			Navigation System
		</CustomItem>
		<CustomItem
			href="/navigation-system-3"
			component={CustomComponent}
			iconBefore={<Icon glyph={Slack} label="" />}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={cssFn}
		>
			Navigation System
		</CustomItem>
		<CustomItem
			href="/navigation-system-4"
			component={CustomComponent}
			iconBefore={<Icon glyph={Slack} label="" />}
			description="Next-gen software project"
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
			cssFn={cssFn}
		>
			Navigation System
		</CustomItem>
	</Box>
);
