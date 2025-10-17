/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode,
	type Ref,
	useCallback,
	useContext,
} from 'react';

import { cx, jsx, cssMap as unboundedCssMap } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { isSafari } from '@atlaskit/ds-lib/device-check';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import Focusable from './focusable';
import type { BasePrimitiveProps, StyleProp } from './types';

type BasePressableProps = {
	/**
	 * Elements to be rendered inside the Pressable.
	 */
	children?: ReactNode;
	/**
	 * Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.
	 */
	onClick?: (e: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Whether the button is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	/**
	 * An optional component name used to identify this component in Atlaskit analytics events. This can be used if a parent component's name is preferred over the default 'Pressable'.
	 */
	componentName?: string;
	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events that come from pressable.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * Forwarded ref.
	 */
	ref?: Ref<HTMLButtonElement>;
};

export type PressableProps = Omit<
	ComponentPropsWithoutRef<'button'>,
	// Handled by `isDisabled`
	| 'disabled'
	// Has a custom handler for analytics
	| 'onClick'
	// Declared in StyleProp
	| 'style'
	| 'className'
> &
	BasePrimitiveProps &
	StyleProp &
	BasePressableProps;

const styles = unboundedCssMap({
	root: {
		boxSizing: 'border-box',
		appearance: 'none',
		border: 'none',
		cursor: 'pointer',
	},
	disabled: {
		cursor: 'not-allowed',
	},
});

/**
 * __Pressable__
 *
 * A primitive for building custom buttons.
 *
 * - [Examples](https://atlassian.design/components/primitives/pressable/examples)
 * - [Code](https://atlassian.design/components/primitives/pressable/code)
 * - [Usage](https://atlassian.design/components/primitives/pressable/usage)
 */
const Pressable: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<PressableProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef(
	(
		{
			children,
			isDisabled,
			type = 'button',
			onClick: providedOnClick = noop,
			interactionName,
			componentName,
			analyticsContext,
			style,
			testId,
			xcss,
			tabIndex,
			...htmlAttributes
		}: PressableProps,
		ref?: Ref<HTMLButtonElement>,
	) => {
		const interactionContext = useContext<InteractionContextType | null>(InteractionContext);
		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
				interactionContext && interactionContext.tracePress(interactionName, e.timeStamp);
				providedOnClick(e, analyticsEvent);
			},
			[providedOnClick, interactionContext, interactionName],
		);

		const onClick = usePlatformLeafEventHandler({
			fn: handleClick,
			action: 'clicked',
			componentName: componentName || 'Pressable',
			packageName: process.env._PACKAGE_NAME_ as string,
			packageVersion: process.env._PACKAGE_VERSION_ as string,
			analyticsData: analyticsContext,
			actionSubject: 'button',
		});

		// This is to remove className from safeHtmlAttributes
		// @ts-expect-error className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
		const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;

		return (
			<Focusable
				// @ts-ignore -- not using expect since it causes issues with help-center local consumption - we don't allow `button` on Focusable for makers as they should use Pressable instead
				as="button"
				// Safari does not apply focus to buttons on click like other browsers, which means click events will not be fired.
				// Adding a tabIndex of 0 to the button will allow it to be focused on click.
				// This is a known issue in Safari that is meant to be "intended", see https://bugs.webkit.org/show_bug.cgi?id=22261
				tabIndex={tabIndex ?? (isSafari() && !isDisabled ? 0 : undefined)}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- TODO: Properly type this and allow pass-through if we can determine the type
				style={style}
				{...safeHtmlAttributes}
				type={type}
				onClick={onClick}
				disabled={isDisabled}
				xcss={cx(styles.root, isDisabled && styles.disabled, xcss)}
				testId={testId}
				ref={ref}
			>
				{children}
			</Focusable>
		);
	},
);

export default Pressable;
