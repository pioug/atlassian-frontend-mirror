/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ArrowRightIcon from '@atlaskit/icon/core/migration/arrow-right--arrow-right-circle';
import {
	type ButtonItemProps,
	type CSSFn,
	type CustomItemComponentProps,
	type Overrides,
} from '@atlaskit/menu';
import { Box, xcss } from '@atlaskit/primitives';
import { N10 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { ButtonItem, CustomItem, NavigationContent } from '../index';
import { ROOT_ID } from '../NestableNavigationContent';
import {
	NestedContext,
	type NestedContextValue,
	useNestedContext,
} from '../NestableNavigationContent/context';
import { useChildIdsEffect } from '../utils/hooks';

import { nestingItemStyle } from './styles';

const iconContainerStyles = xcss({
	display: 'inline',
});

interface NestingItemOverrides extends Overrides {
	/**
	 * Use this to override the back button displayed when navigation is nested.
	 * You'll want to import the [go back item](/packages/navigation/side-navigation/docs/go-back-item) component and use it here.
	 * This will be displayed for all children nesting item components unless they define their own.
	 */
	GoBackItem?: {
		render?: (props: { onClick: () => void; testId?: string }) => React.ReactNode;
	};
}

// Doesn't extend from ButtonItemProps because it blows ERT up.
export interface NestingItemProps<TCustomComponentProps = CustomItemComponentProps> {
	/**
	 * A unique identifier for the nesting item.
	 * Every nesting item component needs a unique ID, or else undefined behavior will occur.
	 */
	id: string;

	/**
	 * Text to display when the nesting item is rendered as a interactable element.
	 */
	title: React.ReactNode;

	/**
	 * The view that should be shown when this nesting item is visible.
	 */
	children: React.ReactNode;

	/**
	 * Used to customize the rendered component when shown as an item.
	 * You can use this for example to change it to a SPA link.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: React.ComponentType<TCustomComponentProps>;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 *
	 * Will set these elements when defined:
	 * - The container - `{testId}--container`
	 * - The nesting item - `{testId}--item`
	 * - The go back item - `{testId}--go-back-item` (only used if you pass in a override).
	 * - The nesting item default right arrow icon - `{testId}--item--right-arrow`
	 */
	testId?: string;

	/**
	 * A function that can be used to override the styles of the component.
	 * It receives the current styles and state and expects a styles object.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	cssFn?: CSSFn;

	/**
	 * Element to render before the item text.
	 * Generally should be an [icon](https://atlassian.design/components/icon/icon-explorer) component.
	 */
	iconBefore?: React.ReactNode;

	/**
	 * Element to render after the item text.
	 * Generally should be an [icon](https://atlassian.design/components/icon/icon-explorer) component.
	 */
	iconAfter?: React.ReactNode;

	/**
	 * Event that is triggered when a person clicks the element.
	 */
	onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Makes the element appear disabled and removes interactivity. Be aware that disabled UI does not appear to people who use assistive technology, so avoid using this if it still needs to appear in the tab order.
	 */
	isDisabled?: boolean;

	/**
	 * Makes the element appear selected.
	 */
	isSelected?: boolean;

	/**
	 * Custom overrides for the composed components.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides?: NestingItemOverrides;
}

/**
 * NestingItem will render itself differently depending in what context it is rendered in.
 * When not open - it will render itself as an item.
 * When open - it will render its children.
 */
const NestingItem = <TCustomComponentProps extends CustomItemComponentProps>(
	props: NestingItemProps<TCustomComponentProps> &
		Omit<TCustomComponentProps, keyof CustomItemComponentProps>,
) => {
	const { children, iconAfter, title, onClick, cssFn, isSelected, id, component, testId, ...rest } =
		props;
	const {
		currentStackId,
		onNest,
		onUnNest,
		backButton: contextualBackButton,
		stack,
		childIds,
		forceShowTopScrollIndicator,
	} = useNestedContext();

	const mergedStyles = overrideStyleFunction(nestingItemStyle, cssFn);

	const [isInteracted, setIsInteracted] = useState(false);

	const backButton =
		(props.overrides &&
			props.overrides.GoBackItem &&
			props.overrides.GoBackItem.render &&
			props.overrides.GoBackItem.render({
				onClick: onUnNest,
				testId: testId && `${testId}--go-back-item`,
			})) ||
		contextualBackButton;

	const context: NestedContextValue = useMemo(
		() => ({
			stack,
			currentStackId,
			onNest,
			onUnNest,
			backButton,
			parentId: id,
			childIds,
			forceShowTopScrollIndicator,
		}),
		[
			stack,
			currentStackId,
			onNest,
			onUnNest,
			backButton,
			id,
			childIds,
			forceShowTopScrollIndicator,
		],
	);

	useChildIdsEffect(childIds, id);

	const isNormalClick = (e: MouseEvent) =>
		!(e.button || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

	/**
	 * We want both the on nest handler and the onclick handler to be called.
	 * We create a wrapper function to call both.
	 */
	const onClickHandler: NonNullable<ButtonItemProps['onClick']> = useCallback(
		(e) => {
			if (isInteracted) {
				// We return early if this has been interacted with because its assumed
				// this will be already exiting - so we don't want to double up the click.
				return;
			}

			// Avoid a nesting transition if a modifier key is detected during click.
			// @ts-expect-error - Argument of type 'MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>' is not assignable to parameter of type 'MouseEvent'
			if (isNormalClick(e)) {
				setIsInteracted(true);
				onNest(id);
			}

			onClick && onClick(e);
		},
		[isInteracted, onClick, onNest, id],
	);

	if (currentStackId === id) {
		return (
			<NestedContext.Provider value={context}>
				{stack.length >= 1 && (
					<Box paddingBlock="space.075" paddingInline="space.100">
						{backButton}
					</Box>
				)}
				<NavigationContent
					testId={testId}
					showTopScrollIndicator={forceShowTopScrollIndicator || stack.length >= 1}
				>
					{children}
				</NavigationContent>
			</NestedContext.Provider>
		);
	}

	if ([ROOT_ID, ...stack].includes(id)) {
		return children as JSX.Element;
	}

	const componentProps = {
		iconAfter: (
			<Fragment>
				{iconAfter ? (
					<Box xcss={iconContainerStyles} data-custom-icon as="span">
						{iconAfter}
					</Box>
				) : null}
				<Box data-right-arrow xcss={iconContainerStyles} as="span">
					<ArrowRightIcon
						testId={testId && `${testId}--item--right-arrow`}
						color="currentColor"
						LEGACY_secondaryColor={token('elevation.surface', N10)}
						label=""
					/>
				</Box>
			</Fragment>
		),
		onClick: onClickHandler,
		isSelected: isSelected,
		testId: testId && `${testId}--item`,
		...rest,
		children: title,
		cssFn: mergedStyles,
	};

	if (component) {
		return (
			<CustomItem<CustomItemComponentProps>
				{...componentProps}
				//@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
				component={component}
			/>
		);
	}

	return <ButtonItem {...componentProps} />;
};

export default NestingItem;
