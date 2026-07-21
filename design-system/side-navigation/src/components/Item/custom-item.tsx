/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import {
	CustomItem as Custom,
	type CustomItemProps,
	type CustomItemComponentProps as MenuCustomItemComponentProps,
} from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/use-should-nested-element-render';

export interface CustomItemComponentProps extends MenuCustomItemComponentProps {}

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
	rootMotion: {
		transition: token('motion.listitem.hovered'),
		'&:hover': {
			transition: token('motion.listitem.pressed'),
		},
		'&:active': {
			transition: token('motion.listitem.pressed'),
		},
	},
	selectedMotion: {
		transition: token('motion.listitem.selected'),
		'&:hover': {
			transition: token('motion.listitem.pressed'),
		},
		'&:active': {
			transition: token('motion.listitem.pressed'),
		},
	},
});

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemPropsHack {
	<TComponentProps extends {}>(
		props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
				TComponentProps,
				keyof CustomItemComponentProps
			>,
	): JSX.Element | null;
}

/**
 * Used to support any custom items needed by products alongside the Header and Footer patterns.
 * Specific implementation of headers and footers are provided in the examples folder.
 *
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
const CustomItem: CustomItemPropsHack = forwardRef<HTMLElement, CustomItemProps>(
	({ className, ...props }, ref) => {
		const { shouldRender } = useShouldNestedElementRender();
		if (!shouldRender) {
			return null;
		}
		const isMotionEnabled = fg('platform-dst-motion-uplift-list-item');
		return (
			<Custom
				ref={ref}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
				css={[
					styles.root,
					isMotionEnabled && styles.rootMotion,
					props.isSelected && styles.selectedStyles,
					props.isSelected && isMotionEnabled && styles.selectedMotion,
				]}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				{...props}
			/>
		);
	},
	// Dirty hack to get generics working with forward ref [2/2]
) as any;

export default CustomItem;
