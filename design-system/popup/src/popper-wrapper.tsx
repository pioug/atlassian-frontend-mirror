/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { UNSAFE_useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';
import { Popper } from '@atlaskit/popper';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { RepositionOnUpdate } from './reposition-on-update';
import { type PopperWrapperProps, type PopupComponentProps } from './types';
import { useCloseManager } from './use-close-manager';
import { useFocusManager } from './use-focus-manager';

const popupFullWidthStyles = css({ width: '100%' });
const popupStyles = css({
	display: 'block',
	boxSizing: 'border-box',
	zIndex: layers.layer(),
	flex: '1 1 auto',
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
const popupOverflowStyles = css({
	overflow: 'auto',
});

// disables iframe pointer events while popup is open, except if iframe is nested inside popup
// solves an issue of popup not being closed on iframe click
const blockPointerEventsOnExternalIframeStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'iframe:not([data-ds--level] iframe)': {
		pointerEvents: 'none',
	},
});

const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>((props, ref) => {
	const { shouldRenderToParent, shouldFitContainer, children, ...htmlAttributes } = props;

	return (
		<div
			css={[
				popupStyles,
				!shouldRenderToParent && popupOverflowStyles,
				shouldFitContainer && popupFullWidthStyles,
			]}
			{...htmlAttributes}
			ref={ref}
		>
			{children}
		</div>
	);
});

function PopperWrapper({
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
	strategy,
	role,
	label,
	titleId,
	modifiers,
}: PopperWrapperProps) {
	const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
	const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement | null>(null);

	// We have cases where we need to close the Popup on Tab press.
	// Example: DropdownMenu
	const shouldCloseOnTab = shouldRenderToParent && shouldDisableFocusLock;
	const shouldDisableFocusTrap = role !== 'dialog';

	useFocusManager({
		initialFocusRef,
		popupRef,
		shouldCloseOnTab,
		triggerRef,
		autoFocus,
		shouldDisableFocusTrap,
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

	const { currentLevel } = UNSAFE_useLayering();

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
		<Popper placement={placement} offset={offset} modifiers={mergedModifiers} strategy={strategy}>
			{({ ref, style, placement, update }) => {
				return (
					<PopupContainer
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
						style={style}
						// using tabIndex={-1} would cause a bug where Safari focuses
						// first on the browser address bar when using keyboard
						tabIndex={autoFocus ? 0 : undefined}
						shouldRenderToParent={shouldRenderToParent}
						shouldFitContainer={shouldFitContainer}
					>
						{fg('platform.design-system-team.iframe_gojiv') && (
							<Global styles={blockPointerEventsOnExternalIframeStyles} />
						)}
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
			}}
		</Popper>
	);
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default PopperWrapper;
