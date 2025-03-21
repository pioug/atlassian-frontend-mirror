/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import { Popper } from '@atlaskit/popper';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { RepositionOnUpdate } from './reposition-on-update';
import { type PopperWrapperProps, type PopupComponentProps } from './types';
import { useCloseManager } from './use-close-manager';
import { useFocusManager } from './use-focus-manager';

const fullWidthStyles = css({ width: '100%' });

const rootStyles = css({
	display: 'block',
	boxSizing: 'border-box',
	zIndex: layers.layer(),
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	// Resetting text color for portal content.
	// Otherwise, when rendering into the parent (not using a portal),
	// the text color can be inherited from the parent.
	color: token('color.text'),
	[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
	'&:focus': {
		outline: 'none',
	},
});

const scrollableStyles = css({
	overflow: 'auto',
});

const blanketStyles = css({
	position: 'fixed',
	inset: 0,
	backgroundColor: token('color.blanket'),
});

const modalStyles = css({
	maxHeight: '50vh',
	position: 'fixed',
	insetBlockStart: token('space.050'),
	insetInline: token('space.050'),
});

const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => {
	const {
		shouldRenderToParent,
		shouldFitContainer,
		children,
		appearance,
		xcss,
		...htmlAttributes
	} = props;

	return (
		<div
			// Because we're using Emotion local jsx namespace we have to coerce xcss prop to a string.
			// When we're fully on Compiled its local jsx namespace accepts the output of xcss prop.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- This rule still fails because of the TS assertion
			className={xcss as string}
			css={[
				rootStyles,
				appearance === 'UNSAFE_modal-below-sm' && modalStyles,
				!shouldRenderToParent && scrollableStyles,
				shouldFitContainer && fullWidthStyles,
			]}
			{...htmlAttributes}
			ref={ref}
		>
			{children}
		</div>
	);
});

function PopperWrapper({
	xcss,
	isOpen,
	id,
	offset,
	testId,
	content,
	fallbackPlacements,
	onClose,
	boundary,
	rootBoundary,
	shouldFlip,
	placement = 'auto',
	// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
	popupComponent: PopupContainer = DefaultPopupComponent,
	autoFocus = true,
	triggerRef,
	shouldUseCaptureOnOutsideClick,
	shouldRenderToParent,
	shouldFitContainer,
	shouldDisableFocusLock,
	shouldReturnFocus = true,
	strategy,
	role,
	label,
	titleId,
	modifiers,
	shouldFitViewport,
	appearance = 'default',
}: PopperWrapperProps) {
	const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
	const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement | null>(null);
	// We have cases where we need to close the Popup on Tab press, e.g. DropdownMenu
	const shouldCloseOnTab = shouldRenderToParent && shouldDisableFocusLock;
	const shouldDisableFocusTrap = role !== 'dialog';

	useFocusManager({
		initialFocusRef,
		popupRef,
		shouldCloseOnTab,
		triggerRef,
		autoFocus,
		shouldDisableFocusTrap,
		shouldReturnFocus,
	});

	useCloseManager({
		isOpen,
		onClose,
		popupRef,
		triggerRef,
		shouldUseCaptureOnOutsideClick,
		shouldCloseOnTab,
		autoFocus,
		shouldDisableFocusTrap,
		shouldRenderToParent,
	});

	const { currentLevel } = useLayering();

	const mergedModifiers = useMemo(
		() => [
			{
				name: 'flip',
				enabled: shouldFlip,
				options: {
					rootBoundary,
					boundary,
					fallbackPlacements,
				},
			},
			...(modifiers || []),
		],
		[shouldFlip, rootBoundary, boundary, fallbackPlacements, modifiers],
	);

	return (
		<Popper
			placement={placement}
			offset={offset}
			modifiers={mergedModifiers}
			strategy={strategy}
			shouldFitViewport={shouldFitViewport}
		>
			{({ ref, style, placement, update }) => {
				const popupContainer = (
					<PopupContainer
						xcss={xcss}
						appearance={appearance}
						id={id}
						data-ds--level={currentLevel}
						data-placement={placement}
						data-testid={testId}
						role={role}
						aria-label={label}
						aria-labelledby={titleId}
						ref={(node: HTMLDivElement) => {
							if (node) {
								if (typeof ref === 'function') {
									ref(node);
								} else {
									(ref as React.MutableRefObject<HTMLElement>).current = node;
								}
								setPopupRef(node);
							}
						}}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={appearance === 'UNSAFE_modal-below-sm' ? {} : style}
						// using tabIndex={-1} would cause a bug where Safari focuses
						// first on the browser address bar when using keyboard
						tabIndex={autoFocus ? 0 : undefined}
						shouldRenderToParent={shouldRenderToParent}
						shouldFitContainer={shouldFitContainer}
					>
						<RepositionOnUpdate update={update}>
							{content({
								update,
								isOpen,
								onClose,
								setInitialFocusRef,
							})}
						</RepositionOnUpdate>
					</PopupContainer>
				);

				return !initialFocusRef && fg('platform-design-system-apply-popup-wrapper-focus') ? (
					<Fragment>
						<FocusRing>{popupContainer}</FocusRing>
						{appearance === 'UNSAFE_modal-below-sm' && <div css={blanketStyles} />}
					</Fragment>
				) : (
					<Fragment>
						{popupContainer}
						{appearance === 'UNSAFE_modal-below-sm' && <div css={blanketStyles} />}
					</Fragment>
				);
			}}
		</Popper>
	);
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default PopperWrapper;
