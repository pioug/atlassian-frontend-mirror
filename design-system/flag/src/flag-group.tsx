/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Children, type ReactElement, useEffect, useMemo, useRef } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { type UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { getDocument } from '@atlaskit/browser-apis';
import { cssMap as cssMapAK, cx } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import { ExitingPersistence, SlideIn, Motion } from '@atlaskit/motion';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';
import { Box } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { defaultFlagGroupContext } from './internal/default-flag-group-context';
import { FlagGroupContext, type FlagGroupAPI } from './internal/flag-group-context';

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

// transition: none is set on first-of-type to prevent a bug in Firefox
// that causes a broken transition
const groupStylesNew = cssMapAK({
	root: {
		position: 'absolute',
		insetBlockEnd: 0,
		transition: token('motion.flag.reposition'),
		width: '400px',
		//@ts-ignore
		'@media (max-width: 560px)': {
			width: '100vw',
		},
	},
	first: {
		transform: 'translate(0,0)',
		//@ts-ignore
		zIndex: 5,
	},
	second: {
		transform: 'translateY(100%) translateY(16px)',
		//@ts-ignore
		zIndex: 4,
	},
	nth: {
		transform: 'translateY(200%) translateY(32px)',
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
	insetBlockEnd: token('space.600'),
	insetInlineStart: token('space.1000'),
	// TODO: Use new breakpoints
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (max-width: 560px)': {
		insetBlockEnd: 0,
		insetInlineStart: 0,
	},
});

// When rendering in top layer, z-index is redundant (top layer stacks above everything).
// Override to avoid leaving an explicit z-index on the container.
const flagGroupContainerStylesTopLayer = css({
	zIndex: 'initial',
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

	// Keep a stable reference to the latest children, dismiss handler, and
	// analytics creator so the keydown listener never reads stale closures.
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const latestRef = useRef<{
		children: FlagGroupProps['children'];
		onDismissed: FlagGroupProps['onDismissed'];
		createAnalyticsEvent: typeof createAnalyticsEvent;
	}>({ children, onDismissed, createAnalyticsEvent });
	latestRef.current = { children, onDismissed, createAnalyticsEvent };

	// Accessibility (JRACLOUD-97876): allow keyboard-only and assistive
	// technology users to dismiss the topmost (and only dismissable) flag with
	// the Escape key, without having to tab through the entire page to reach
	// the dismiss button. Behaviour is gated behind a feature flag so it can
	// be rolled out and validated incrementally.
	useEffect(() => {
		if (!fg('platform_dst_flag_keyboard_dismiss')) {
			return;
		}
		if (!hasFlags) {
			return;
		}

		const doc = getDocument();
		if (!doc) {
			return;
		}

		return bind(doc, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key !== 'Escape' || event.defaultPrevented) {
					return;
				}

				const currentChildren = latestRef.current.children;
				const firstFlag = Array.isArray(currentChildren)
					? currentChildren.find(Boolean)
					: currentChildren;

				if (!firstFlag || typeof firstFlag !== 'object') {
					return;
				}

				const id = (firstFlag as ReactElement).props?.id;
				if (id === undefined || id === null || id === '') {
					return;
				}

				const analyticsEvent = latestRef.current.createAnalyticsEvent({
					action: 'dismissed',
					actionSubject: 'flag',
					attributes: { dismissedVia: 'keyboardShortcut', key: 'Escape' },
				});

				event.preventDefault();
				latestRef.current.onDismissed?.(id, analyticsEvent);
			},
		});
	}, [hasFlags]);

	const renderChildren = () => {
		return children && typeof children === 'object'
			? Children.map(children, (flag: ReactElement, index: number) => {
					const isDismissAllowed = index === 0;

					return fg('platform-dst-motion-uplift') ? (
						<Box
							xcss={cx(
								groupStylesNew.root,
								index === 0 && groupStylesNew.first,
								index === 1 && groupStylesNew.second,
								index >= 2 && groupStylesNew.nth,
								index >= 3 && groupStylesNew.hidden,
							)}
							data-vc-oob
						>
							<Motion
								enteringAnimation={token('motion.flag.enter')}
								exitingAnimation={token('motion.flag.exit')}
							>
								<FlagGroupContext.Provider
									value={
										// Only the first flag should be able to be dismissed.
										isDismissAllowed ? dismissFlagContext : defaultFlagGroupContext
									}
								>
									{flag}
								</FlagGroupContext.Provider>
							</Motion>
						</Box>
					) : (
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

	const useTopLayer = fg('platform-dst-top-layer');

	const isKeyboardDismissEnabled = fg('platform_dst_flag_keyboard_dismiss');
	// When the keyboard dismiss shortcut is available, surface it to assistive
	// technology users via the existing visually-hidden landmark heading so they
	// know they can press Escape to dismiss the topmost flag.
	const screenReaderLabel = isKeyboardDismissEnabled ? `${label}. Press Escape to dismiss.` : label;

	const flags = (
		<div
			id={id}
			css={[flagGroupContainerStyles, useTopLayer && flagGroupContainerStylesTopLayer]}
			data-vc-oob
		>
			{hasFlags ? (
				<VisuallyHidden>
					{/* @ts-ignore - TS2604/TS2786: LabelTag type union causing issues for help-center local consumption with TS 5.9.2 */}
					<LabelTag>{screenReaderLabel}</LabelTag>
				</VisuallyHidden>
			) : null}

			<ExitingPersistence appear={false}>{renderChildren()}</ExitingPersistence>
		</div>
	);

	if (useTopLayer) {
		return <Popover mode="manual" isOpen={true}>{flags}</Popover>;
	}

	return shouldRenderToParent ? flags : <Portal zIndex={layers.flag()}>{flags}</Portal>;
};

export default FlagGroup;
