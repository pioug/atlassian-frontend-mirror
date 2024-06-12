/** @jsx jsx */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { ExitingPersistence } from '@atlaskit/motion';

import { GoBackItem as GoBackButton } from '../Item';
import { default as NestingItem } from '../NestingItem';
import { useChildIds } from '../utils/hooks';

import { NestedContext, type NestedContextValue } from './context';
import { NestingMotion } from './nesting-motion';
// Named so ERT doesn't pick up the override name as a type.

export const ROOT_ID = 'ATLASKIT_NESTED_ROOT';

export interface NestableNavigationContentProps {
	/**
	 * The NestableNavigationContent wraps the entire navigation hierarchy of a side navigation.
	 * Using this component is only needed if you want to enable nested views with [nesting items](/packages/navigation/side-navigation/docs/nesting-item),
	 * otherwise you should use [navigation content](/packages/navigation/side-navigation/docs/navigation-content) instead.
	 */
	children: JSX.Element | JSX.Element[];

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 * Will set these elements when defined:
	 * - This wrapper - `{testId}`
	 * - The back item (displayed when inside a nested view) - `{testId}--go-back-item`
	 */
	testId?: string;

	/**
	 * This forces the top scroll indicator to be shown. Use this prop when you need to
	 * distinctly separate the side navigation header from the side navigation content.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	showTopScrollIndicator?: boolean;

	/**
	 * Array of the initial stack you want to show.
	 * This is useful when you want to set the initial nested view but don't want to opt into a controlled state.
	 * Make sure to have all intermediate navigation pages line up.
	 */
	initialStack?: string[];

	/**
	 * Enables you to control the stack of navigation views you want to show.
	 * Do not jump between controlled and uncontrolled else undefined behaviour will occur.
	 * This means either using `initialStack` OR `stack` but not both.
	 * Make sure your stack array has a stable reference and does not change between renders.
	 */
	stack?: string[];

	/**
	 * Allows you to react based on transitions between [nesting items](/packages/navigation/side-navigation/docs/nesting-item).
	 * It will be called everytime a person navigates from one [nesting item](/packages/navigation/side-navigation/docs/nesting-item) to another,
	 * both up or down the navigation hierarchy.
	 * This prop should be used with the `stack` prop for controlled behavior.
	 */
	onChange?: (stack: string[]) => void;

	/**
	 * Called when a nesting ID that does not exist among `<NestingItem>`s is pushed to the stack. Use this callback to be notified when there is an undefined nesting state.
	 * Provides you with the stack which led to the undefined state, with the top of the stack (last item in array) being the invalid item.
	 */
	onUnknownNest?: (stack: string[]) => void;

	/**
	 * Custom overrides for the composed components.
	 *
	 *   @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2682 for more information.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides?: {
		/**
		 * Use this to override the default back button displayed when navigation is nested.
		 * You'll want to import the [go back item](/packages/navigation/docs/go-back-item) component and use it here.
		 * This will be displayed for all children [nesting items](/packages/navigation/side-navigation/docs/nesting-item) unless they define their own.
		 */
		GoBackItem?: {
			render?: (props: { onClick: () => void; testId?: string }) => React.ReactNode;
		};
	};
}

const nestableNavigationContentStyles = css({
	height: '100%',
	position: 'relative',
	outline: 'none',
});

const nestingRootStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
	position: 'absolute',
	flexDirection: 'column',
});

/**
 * __Nestable navigation content__
 *
 * The container for navigation items with nested views
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#nested-navigation)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NestableNavigationContent = (props: NestableNavigationContentProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const {
		children,
		testId,
		overrides,
		initialStack,
		onChange,
		onUnknownNest,
		stack,
		showTopScrollIndicator,
	} = props;
	const [committedStack, setCommittedStack] = useState(stack || initialStack || []);
	const controlledStack = stack || undefined;
	const currentStackId = committedStack[committedStack.length - 1] || ROOT_ID;
	const [transition, setTransition] = useState('nesting');
	const backTestId = testId && `${testId}--go-back-item`;
	const renderGoBackItem =
		overrides && overrides.GoBackItem && overrides.GoBackItem.render
			? overrides.GoBackItem.render
			: (props: {}) => <GoBackButton {...props}>Go back</GoBackButton>;

	const { childIdsRef } = useChildIds(currentStackId, committedStack, onUnknownNest);

	const onNestHandler = useCallback(
		(layerId: string) => {
			onChange && onChange(committedStack.concat(layerId));
			if (controlledStack) {
				// We are in controlled mode - ignore the steps.
				return;
			}

			// We need to split the state update into to parts.
			// First: Updating the direction of the motions.
			// Second: Actually updating the stack (which will cause elements to enter & leave).
			setTransition('nesting');

			requestAnimationFrame(() => {
				setCommittedStack((prev) => {
					const newStack = prev.concat(layerId);
					return newStack;
				});
			});
		},
		[controlledStack, onChange, committedStack],
	);

	const onUnNestHandler = useCallback(() => {
		onChange && onChange(committedStack.slice(0, committedStack.length - 1));

		if (controlledStack) {
			// We are in controlled mode - ignore the steps.
			return;
		}

		// We need to split the state update into to parts.
		// First: Updating the direction of the motions.
		// Second: Actually updating the stack (which will cause elements to enter & leave).
		setTransition('unnesting');

		requestAnimationFrame(() => {
			setCommittedStack((prev) => {
				const newStack = prev.slice(0, prev.length - 1);
				return newStack;
			});
		});
	}, [controlledStack, onChange, committedStack]);

	useEffect(() => {
		if (!controlledStack) {
			// We aren't in controlled mode - bail out.
			return;
		}

		if (JSON.stringify(committedStack) === JSON.stringify(controlledStack)) {
			// stacks are equal - do nothing!
			return;
		}

		// Controlled prop updated, let's figure out if we're nesting or unnesting.
		if (controlledStack.length < committedStack.length) {
			// We are unnesting (removing from the stack)
			setTransition('unnesting');
		} else {
			// We are nesting (adding to the stack)
			setTransition('nesting');
		}

		requestAnimationFrame(() => {
			setCommittedStack(controlledStack!);
		});
	}, [committedStack, controlledStack]);

	const backButton = renderGoBackItem({
		onClick: onUnNestHandler,
		testId: backTestId,
	});

	const context: NestedContextValue = useMemo(
		() => ({
			currentStackId,
			backButton,
			stack: committedStack,
			onNest: onNestHandler,
			onUnNest: onUnNestHandler,
			parentId: ROOT_ID,
			childIds: childIdsRef,
			forceShowTopScrollIndicator: showTopScrollIndicator,
		}),
		[
			currentStackId,
			backButton,
			committedStack,
			onNestHandler,
			onUnNestHandler,
			childIdsRef,
			showTopScrollIndicator,
		],
	);

	const manageFocus = (event: React.MouseEvent | React.KeyboardEvent<HTMLDivElement>) => {
		const triggeredByKeyboard = event.nativeEvent.detail === 0;
		if (triggeredByKeyboard) {
			containerRef.current && containerRef.current.focus();
		}
	};

	return (
		<Fragment>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
			<div
				data-testid={testId}
				css={nestableNavigationContentStyles}
				ref={containerRef}
				tabIndex={-1}
				onClick={manageFocus}
			>
				<ExitingPersistence>
					<NestingMotion
						// Key is needed to have a unique react instance per stack name.
						// This enables us to easily animate it in & out with exiting persistence.
						key={currentStackId}
						enterFrom={transition === 'nesting' ? 'right' : 'left'}
						exitTo={transition === 'nesting' ? 'left' : 'right'}
						testId={testId && `${testId}-anim`}
					>
						{(motion) => (
							<div css={nestingRootStyles} {...motion}>
								<NestedContext.Provider
									// This provider is inside the NestingMotion to ensure it keeps a stale
									// reference to the previous value.
									value={context}
								>
									<NestingItem title="" id={ROOT_ID}>
										{children}
									</NestingItem>
								</NestedContext.Provider>
							</div>
						)}
					</NestingMotion>
				</ExitingPersistence>
			</div>
		</Fragment>
	);
};

export default NestableNavigationContent;
