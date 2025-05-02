/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { type CustomItemComponentProps } from '@atlaskit/menu';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { CustomItem } from '../Item';

const styles = cssMap({
	header: {
		// Need to increase specificity here until CustomItem is updated to use @compiled/react
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			userSelect: 'auto',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-title]': {
			font: token('font.heading.xsmall'),
			color: token('color.text', N500),
		},
		// Will look interactive if the `component` is anything other than a div.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div&:hover': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			cursor: 'default',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div&:active': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			color: token('color.text', N500),
		},
	},
});

/**
 * __Container__
 *
 * A container for Header and Footer that safely handles props to the child component
 */
export const Container = ({
	children,
	'data-testid': testId,
	...props
}: CustomItemComponentProps) => {
	// https://stackoverflow.com/a/39333479
	const safeProps = (({
		className,
		onClick,
		onMouseDown,
		onDragStart,
		draggable,
		ref,
		tabIndex,
		disabled,
	}) => ({
		className,
		onClick,
		onMouseDown,
		onDragStart,
		draggable,
		ref,
		tabIndex,
		disabled,
	}))(props);
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<div data-testid={testId} style={{ position: 'relative' }} {...safeProps}>
			{children}
		</div>
	);
};

export type HeaderProps = {
	/**
	 * Element to render before the item text.
	 * Generally should be an [icon](https://atlassian.design/components/icon/icon-explorer) component.
	 */
	iconBefore?: React.ReactNode;

	/**
	 * Event that is triggered when the element is clicked.
	 */
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;

	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Primary content for the item.
	 */
	children?: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Custom component to render as an item.
	 * This can be both a functional component or a class component.
	 * __Will return `null` if no component is defined.__
	 * __NOTE:__ Make sure the reference for this component does not change between renders else undefined behavior may happen.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: React.ComponentType<CustomItemComponentProps>;
};

/**
 * __Header__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Header = forwardRef<HTMLElement, HeaderProps>((props: HeaderProps, ref) => {
	return (
		<CustomItem
			{...props}
			ref={ref}
			component={props.component || Container}
			css={styles.header}
			isTitleHeading
		/>
	);
});

export default Header;
