/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, useEffect, useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import { useCloseOnEscapePress, useLayering } from '@atlaskit/layering';
import FadeIn from '@atlaskit/motion/fade-in';
import { fg } from '@atlaskit/platform-feature-flags';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { ModalContext, ScrollContext } from '../context';
import useOnMotionFinish from '../hooks/use-on-motion-finish';
import { disableDraggingToCrossOriginIFramesForElement } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { disableDraggingToCrossOriginIFramesForExternal } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import type { InternalModalDialogProps } from '../types';
import { dialogHeight, dialogWidth } from '../utils';

import Positioner from './positioner';

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

const dialogStyles = cssMap({
	root: {
		display: 'flex',

		width: '100%',
		maxWidth: '100vw',

		height: '100%',
		minHeight: '0px',
		maxHeight: '100vh',

		// Flex-grow set to 0 to prevent this element from filling its parent flexbox container
		flex: '0 1 auto',
		flexDirection: 'column',

		backgroundColor: token('elevation.surface.overlay'),
		color: token('color.text'),
		[LOCAL_CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
		pointerEvents: 'auto',

		'@media (min-width: 30rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&&': {
				width: 'var(--modal-dialog-width)',
			},
			// @ts-expect-error
			maxWidth: 'inherit',
			boxShadow: token('elevation.shadow.overlay'),
			// @ts-expect-error
			marginInlineEnd: 'inherit',
			// @ts-expect-error
			marginInlineStart: 'inherit',
		},

		// focus ring styles
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			// @ts-expect-error
			outlineOffset: token('border.width.focused'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
		},

		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineStyle: 'solid',
				// @ts-expect-error
				outlineWidth: 1,
			},
		},

		/**
		 * This is to support scrolling if the modal's children are wrapped in
		 * a form.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& > form:only-child': {
			display: 'inherit',
			maxHeight: 'inherit',
			flexDirection: 'inherit',
		},
	},
	borderRadius: {
		'@media (min-width: 30rem)': {
			borderRadius: token('radius.small', '3px'),
		},
	},
	// platform-dst-shape-theme-default TODO: Merge into base after rollout
	borderRadiusT26Shape: {
		'@media (min-width: 30rem)': {
			borderRadius: token('radius.xlarge', '12px'),
		},
	},
});

const viewportScrollStyles = css({
	/**
	 * This ensures that the element fills the viewport on mobile
	 * while also allowing it to overflow if its height is larger than
	 * the viewport.
	 */
	minHeight: '100vh',
	maxHeight: 'none',

	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles
		'&&': {
			minHeight: 'var(--modal-dialog-height)',
		},
	},
});

const bodyScrollStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles
		'&&': {
			height: 'var(--modal-dialog-height)',
			maxHeight: 'inherit',
		},
	},
});

const ModalDialog = (props: InternalModalDialogProps): JSX.Element => {
	const {
		width = 'medium',
		shouldScrollInViewport = false,
		shouldCloseOnEscapePress,
		autoFocus: providedAutoFocus,
		stackIndex,
		onClose,
		onCloseComplete,
		onOpenComplete,
		height,
		hasProvidedOnClose,
		children,
		label,
		testId,
		isFullScreen = false,
	} = props;

	const id = useId();
	const titleId = `modal-dialog-title-${id}`;
	const defaultTestId = testId || 'modal-dialog';
	// https://product-fabric.atlassian.net/browse/DSP-24307
	// If flag and falsy, use true instead.
	// When we remove boolean `autoFocus`, we won't have to worry about this
	const autoFocus = !providedAutoFocus ? true : providedAutoFocus;

	useEffect(() => {
		// Modal dialogs can appear on top of iframe elements that are on another domain.
		// There is a Chrome bug where drag and drop in an element on top of a cross domain
		// iframe is not working. We are applying the workaround for this bug in modal so
		// that consumers of our modal don't have to worry about this bug and are free to
		// create whatever drag and drop experience they like inside a modal
		//
		// Chrome bug: https://issues.chromium.org/issues/362301053

		return combine(
			disableDraggingToCrossOriginIFramesForElement(),
			disableDraggingToCrossOriginIFramesForTextSelection(),
			disableDraggingToCrossOriginIFramesForExternal(),
		);
	}, []);

	useAutoFocus(
		typeof autoFocus === 'object' ? autoFocus : undefined,
		// When a user supplies  a ref to focus we enable this hook
		typeof autoFocus === 'object',
	);

	const [motionRef, onMotionFinish] = useOnMotionFinish({
		onOpenComplete,
		onCloseComplete,
	});

	const modalDialogContext = useMemo(
		() => ({ testId: defaultTestId, titleId, onClose, hasProvidedOnClose, isFullScreen }),
		[defaultTestId, titleId, onClose, hasProvidedOnClose, isFullScreen],
	);

	useCloseOnEscapePress({
		onClose,
		isDisabled: !shouldCloseOnEscapePress,
	});

	const { currentLevel } = useLayering();
	return (
		<Positioner
			stackIndex={stackIndex!}
			shouldScrollInViewport={shouldScrollInViewport}
			testId={defaultTestId}
			isFullScreen={isFullScreen}
		>
			<ModalContext.Provider value={modalDialogContext}>
				<ScrollContext.Provider value={shouldScrollInViewport}>
					<FadeIn
						/**
						 * We don't want a 'slide in' for the full screen modals.
						 */
						entranceDirection={isFullScreen ? undefined : 'bottom'}
						onFinish={onMotionFinish}
					>
						{(bottomFadeInProps) => (
							// TODO: Use `dialog` element instead of overriding section semantics (DSP-11588)
							<section
								{...bottomFadeInProps}
								aria-label={label}
								ref={mergeRefs([bottomFadeInProps.ref, motionRef])}
								style={
									{
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										'--modal-dialog-width': dialogWidth(width),
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										'--modal-dialog-height': dialogHeight(height),
									} as CSSProperties
								}
								css={[
									dialogStyles.root,
									!isFullScreen && dialogStyles.borderRadius,
									!isFullScreen &&
										fg('platform-dst-shape-theme-default') &&
										dialogStyles.borderRadiusT26Shape,
									shouldScrollInViewport ? viewportScrollStyles : bodyScrollStyles,
								]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
								className={bottomFadeInProps.className}
								role="dialog"
								aria-labelledby={label ? undefined : titleId}
								data-testid={defaultTestId}
								data-modal-stack={stackIndex}
								tabIndex={-1}
								aria-modal={true}
								data-ds--level={currentLevel}
							>
								{children}
							</section>
						)}
					</FadeIn>
				</ScrollContext.Provider>
			</ModalContext.Provider>
		</Positioner>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ModalDialog;
