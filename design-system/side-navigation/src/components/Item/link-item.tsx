/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { LinkItem as Link, type LinkItemProps } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { LinkItemProps } from '@atlaskit/menu';

const styles = cssMap({
	root: {
		// This padding is set to ensure that the center of the left icon
		// is approximately center aligned with the horizontal app switcher.
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			color: token('color.text.subtle'),
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			'&:active': {
				color: token('color.text.subtle'),
				backgroundColor: token('color.background.neutral.subtle.pressed'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-before]': {
			height: '1.5rem',
			width: '1.5rem',
		},
	},
	selectedStyles: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&:visited': {
			color: token('color.text.selected'),
		},
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
			color: token('color.text.selected'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
			color: token('color.text.selected'),
		},
	},
});

/**
 * __Link item__
 *
 * Renders an item wrapped in an anchor tag, useful when you have an item that
 * should change routes using native browser navigation. For SPA transitions use
 * a [custom item](https://atlassian.design/components/side-navigation/examples#custom-item)
 * with the respective router logic.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#link-item)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const LinkItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<LinkItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, LinkItemProps>(({ href, children, className, ...rest }, ref) => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	// Anchor content will be handled by LinkItem
	return (
		<Link
			ref={ref}
			href={href}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={[styles.root, rest.isSelected && styles.selectedStyles]}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			{...rest}
		>
			{children}
		</Link>
	);
});

export default LinkItem;
