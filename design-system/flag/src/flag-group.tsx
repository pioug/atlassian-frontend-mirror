/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Children, createContext, type ReactElement, useContext, useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { ExitingPersistence, SlideIn } from '@atlaskit/motion';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

type FlagGroupProps = {
	/**
	 * ID attribute used for DOM selection.
	 */
	id?: string;
	/**
	 * Describes the specific role of this FlagGroup for users viewing the page with a screen reader (defaults to `Flag notifications`).
	 */
	label?: string;
	/**
	 * Describes the specific tag on which the screen reader text will be rendered (defaults to `h2`).
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	labelTag?: React.ElementType;
	/**
	 * Flag elements to be displayed.
	 */
	children?: Array<ReactElement> | ReactElement | null | boolean;
	/**
	 * Handler which will be called when a Flag's dismiss button is clicked.
	 * Receives the id of the dismissed Flag as a parameter.
	 */
	onDismissed?: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Controls whether the flag group is rendered inline within its parent component or in a portal at the document root.
	 * `true` renders the flag group in the DOM node closest to the trigger
	 * `false` renders the flag group in React.Portal
	 * Defaults to `false`.
	 */
	shouldRenderToParent?: boolean;
};

export const flagWidth = 400;

type FlagGroupAPI = {
	onDismissed: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
	isDismissAllowed: boolean;
};

const defaultFlagGroupContext = {
	onDismissed: noop,
	isDismissAllowed: false,
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const FlagGroupContext: import('react').Context<FlagGroupAPI> =
	createContext<FlagGroupAPI>(defaultFlagGroupContext);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export function useFlagGroup(): FlagGroupAPI {
	return useContext(FlagGroupContext);
}

// transition: none is set on first-of-type to prevent a bug in Firefox
// that causes a broken transition
const groupStyles = cssMap({
	root: {
		width: flagWidth,
		position: 'absolute',
		insetBlockEnd: 0,
		transition: 'transform 350ms ease-in-out',
		'@media (max-width: 560px)': {
			width: '100vw',
		},
	},
	first: {
		transform: 'translate(0,0)',
		transition: 'none',
		zIndex: 5,
	},
	second: {
		zIndex: 4,
	},
	nth: {
		animationDuration: '0ms',
		transform: 'translateX(0) translateY(100%) translateY(16px)',
	},
	hidden: {
		visibility: 'hidden',
	},
});

// Transform needed to push up while 1st flag is leaving
// Exiting time should match the exiting time of motion so is halved
const dismissAllowedStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&& + *': {
		transitionDuration: '175ms',
	},
});

const flagGroupContainerStyles = css({
	position: 'fixed',
	zIndex: 'flag',
	insetBlockEnd: token('space.600', '48px'),
	insetInlineStart: token('space.1000', '80px'),
	// TODO: Use new breakpoints
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (max-width: 560px)': {
		insetBlockEnd: 0,
		insetInlineStart: 0,
	},
});

/**
 * __Flag group__
 *
 * A flag group is used to group a set of related flags, with entry and exit animations.
 *
 * - [Examples](https://atlassian.design/components/flag/flag-group/examples)
 * - [Code](https://atlassian.design/components/flag/flag-group/code)
 */
const FlagGroup = (props: FlagGroupProps): JSX.Element => {
	const {
		id,
		label = 'Flag notifications',
		labelTag: LabelTag = 'h2',
		shouldRenderToParent = false,
		children,
		onDismissed = noop,
	} = props;

	const hasFlags = Array.isArray(children) ? children.length > 0 : Boolean(children);

	const dismissFlagContext: FlagGroupAPI = useMemo(
		() => ({
			onDismissed: onDismissed,
			isDismissAllowed: true,
		}),
		[onDismissed],
	);

	const renderChildren = () => {
		return children && typeof children === 'object'
			? Children.map(children, (flag: ReactElement, index: number) => {
					const isDismissAllowed = index === 0;

					return (
						<SlideIn
							enterFrom="left"
							fade="inout"
							duration="medium"
							animationTimingFunction="ease-in"
						>
							{({ className, ref }) => (
								<div
									css={[
										groupStyles.root,
										index === 0 && groupStyles.first,
										index === 1 && groupStyles.second,
										index >= 1 && groupStyles.nth,
										index >= 2 && groupStyles.hidden,
										isDismissAllowed && dismissAllowedStyles,
									]}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className={className}
									ref={ref}
									data-vc-oob
								>
									<FlagGroupContext.Provider
										value={
											// Only the first flag should be able to be dismissed.
											isDismissAllowed ? dismissFlagContext : defaultFlagGroupContext
										}
									>
										{flag}
									</FlagGroupContext.Provider>
								</div>
							)}
						</SlideIn>
					);
				})
			: false;
	};

	const flags = (
		<div id={id} css={flagGroupContainerStyles} data-vc-oob>
			{hasFlags ? (
				<VisuallyHidden>
					{/* @ts-ignore - TS2604/TS2786: LabelTag type union causing issues for help-center local consumption with TS 5.9.2 */}
					<LabelTag>{label}</LabelTag>
				</VisuallyHidden>
			) : null}

			<ExitingPersistence appear={false}>{renderChildren()}</ExitingPersistence>
		</div>
	);

	return shouldRenderToParent ? flags : <Portal zIndex={layers.flag()}>{flags}</Portal>;
};

export default FlagGroup;
