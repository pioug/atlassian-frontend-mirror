/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';
import { Box } from '@atlaskit/primitives/compiled';
import { B100 } from '@atlaskit/theme/colors';

import Slack from '../icons/slack';

type CustomComponentWithHrefProps = CustomItemComponentProps & {
	href: string;
};

const CustomComponent = ({ children, href, ...props }: CustomComponentWithHrefProps) => {
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @atlaskit/design-system/no-html-anchor, @atlaskit/design-system/no-html-anchor
		<a href={href} {...props}>
			{children}
		</a>
	);
};

const styles = cssMap({
	root: {
		position: 'relative',
		overflow: 'hidden',
		userSelect: 'none',
	},
	interactive: {
		'&::before': {
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
		'&:hover::before': {
			transform: 'translateX(0)',
		},
	},
});

const _default: () => JSX.Element = () => (
	/**
	 * It is not normally acceptable to add click handlers to non-interactive elements
	 * as this is an accessibility anti-pattern. However, because this instance is
	 * for performance reasons (to avoid multiple click handlers) and not creating an
	 * inaccessible custom element, we can add role="presentation" so that there is
	 * no negative impacts to assistive technologies.
	 */
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
	<Box onClick={(e: React.MouseEvent) => e.preventDefault()} role="presentation">
		<CustomItem
			href="/navigation-system"
			component={CustomComponent}
			css={[styles.root, styles.interactive]}
		>
			CustomItem
		</CustomItem>
		<CustomItem
			href="/navigation-system-1"
			isSelected
			component={CustomComponent}
			css={[styles.root, styles.interactive]}
		>
			isSelected CustomItem
		</CustomItem>
		<CustomItem
			href="/navigation-system-2"
			isDisabled
			component={CustomComponent}
			css={styles.root}
		>
			isDisabled CustomItem
		</CustomItem>
		<CustomItem
			href="/navigation-system-3"
			component={CustomComponent}
			iconBefore={<Slack aria-label="" />}
			css={[styles.root, styles.interactive]}
		>
			iconBefore CustomItem
		</CustomItem>
		<CustomItem
			href="/navigation-system-4"
			component={CustomComponent}
			iconBefore={<Slack aria-label="" />}
			description="Next-gen software project"
			css={[styles.root, styles.interactive]}
		>
			iconBefore and description CustomItem
		</CustomItem>
	</Box>
);
export default _default;
