/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, useMemo, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { ax } from '@compiled/react/runtime';

import { useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import { Popper } from '@atlaskit/popper';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { RepositionOnUpdate } from './reposition-on-update';
import { type PopperWrapperProps, type PopupComponentProps } from './types';
import { useCloseManager } from './use-close-manager';
import { useFocusManager } from './use-focus-manager';

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

const fullWidthStyles = css({ width: '100%' });

const wrapperStyles = cssMap({
	root: {
		display: 'block',
		boxSizing: 'border-box',
		zIndex: 400,
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('border.radius'),
		boxShadow: token('elevation.shadow.overlay'),
		// Resetting text color for portal content.
		// Otherwise, when rendering into the parent (not using a portal),
		// the text color can be inherited from the parent.
		color: token('color.text'),
		[LOCAL_CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
		'&:focus': {
			outline: 'none',
		},
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

const focusRingStyles = cssMap({
	root: {
		'&:focus-visible': {
			outlineColor: token('color.border.focused', '#2684ff'),
			// @ts-ignore
			outlineOffset: token('border.width.outline'),
			outlineStyle: 'solid',
			// @ts-ignore
			outlineWidth: token('border.width.outline'),
		},
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineStyle: 'solid',
				outlineWidth: 1,
			},
		},
	},
});

const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => {
	const {
		shouldRenderToParent,
		shouldFitContainer,
		children,
		appearance,
		className,
		isReferenceHidden,
		...htmlAttributes
	} = props;

	return (
		<div
			css={[
				wrapperStyles.root,
				appearance === 'UNSAFE_modal-below-sm' && modalStyles,
				!shouldRenderToParent && scrollableStyles,
				shouldFitContainer && fullWidthStyles,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
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
			{({ ref, style, placement, update, isReferenceHidden }) => {
				const popupContainer = (
					<PopupContainer
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className={ax([
							xcss as string,
							// @ts-expect-error: `ax` is not typed correctly
							!initialFocusRef &&
								// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
								fg('platform-design-system-apply-popup-wrapper-focus') &&
								focusRingStyles.root,
						])}
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
						isReferenceHidden={isReferenceHidden}
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

				return (
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
