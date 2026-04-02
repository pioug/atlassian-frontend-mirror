/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { ButtonItem as Button, type ButtonItemProps } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { ButtonItemProps } from '@atlaskit/menu';

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
 * __Button item__
 *
 * A button item renders an item wrapped in a button tag, used primarily when an
 * action does something other than changing routes.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#button-item)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const ButtonItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ButtonItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ButtonItemProps>(({ className, ...props }, ref) => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	return (
		<Button
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={[styles.root, props.isSelected && styles.selectedStyles]}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			{...props}
		/>
	);
});

export default ButtonItem;
