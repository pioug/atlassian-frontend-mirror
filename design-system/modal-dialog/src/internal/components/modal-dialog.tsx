/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, useEffect, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import FocusRing from '@atlaskit/focus-ring';
import { useCloseOnEscapePress, useLayering } from '@atlaskit/layering';
import FadeIn from '@atlaskit/motion/fade-in';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { media } from '@atlaskit/primitives';
import { N0, N30A, N60A, N900 } from '@atlaskit/theme/colors';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import type { KeyboardOrMouseEvent, ModalDialogProps } from '../../types';
import { ModalContext, ScrollContext } from '../context';
import useOnMotionFinish from '../hooks/use-on-motion-finish';
import { disableDraggingToCrossOriginIFramesForElement } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { disableDraggingToCrossOriginIFramesForExternal } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import { dialogHeight, dialogWidth } from '../utils';

import Positioner from './positioner';

const dialogStyles = css({
	display: 'flex',

	width: '100%',
	maxWidth: '100vw',

	height: '100%',
	minHeight: 0,
	maxHeight: '100vh',

	// Flex-grow set to 0 to prevent this element from filling its parent flexbox container
	flex: '0 1 auto',
	flexDirection: 'column',

	backgroundColor: token('elevation.surface.overlay', N0),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: token('color.text', N900),
	[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
	pointerEvents: 'auto',

	[media.above.xs]: {
		width: 'var(--modal-dialog-width)',
		maxWidth: 'inherit',
		borderRadius: token('border.radius', '3px'),
		boxShadow: token(
			'elevation.shadow.overlay',
			`0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
		),
		marginInlineEnd: 'inherit',
		marginInlineStart: 'inherit',
	},

	/**
	 * This is to support scrolling if the modal's children are wrapped in
	 * a form.
	 */
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& > form:only-child': {
		display: 'inherit',
		maxHeight: 'inherit',
		flexDirection: 'inherit',
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

	[media.above.xs]: {
		minHeight: 'var(--modal-dialog-height)',
	},
});

const bodyScrollStyles = css({
	[media.above.xs]: {
		height: 'var(--modal-dialog-height)',
		maxHeight: 'inherit',
	},
});

const ModalDialog = (
	props: ModalDialogProps & { onClose: (value: KeyboardOrMouseEvent) => void },
) => {
	const {
		width = 'medium',
		shouldScrollInViewport = false,
		shouldCloseOnEscapePress,
		autoFocus,
		stackIndex,
		onClose,
		onCloseComplete,
		onOpenComplete,
		height,
		children,
		label,
		testId,
	} = props;

	const id = useId();
	const titleId = `modal-dialog-title-${id}`;

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
		() => ({ testId, titleId, onClose }),
		[testId, titleId, onClose],
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
			testId={testId}
		>
			<ModalContext.Provider value={modalDialogContext}>
				<ScrollContext.Provider value={shouldScrollInViewport}>
					<FadeIn entranceDirection="bottom" onFinish={onMotionFinish}>
						{(bottomFadeInProps) => (
							<FocusRing>
								{/* TODO: Use `dialog` element instead of overriding section semantics (DSP-11588) */}
								<section
									{...bottomFadeInProps}
									aria-label={label}
									ref={mergeRefs([bottomFadeInProps.ref, motionRef])}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									style={
										{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
											'--modal-dialog-width': dialogWidth(width),
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
											'--modal-dialog-height': dialogHeight(height),
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										} as CSSProperties
									}
									css={[
										dialogStyles,
										shouldScrollInViewport ? viewportScrollStyles : bodyScrollStyles,
									]}
									role="dialog"
									aria-labelledby={label ? undefined : titleId}
									data-testid={testId}
									data-modal-stack={stackIndex}
									tabIndex={-1}
									aria-modal={true}
									data-ds--level={currentLevel}
								>
									{children}
								</section>
							</FocusRing>
						)}
					</FadeIn>
				</ScrollContext.Provider>
			</ModalContext.Provider>
		</Positioner>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ModalDialog;
