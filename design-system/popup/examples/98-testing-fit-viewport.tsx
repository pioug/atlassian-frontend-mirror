/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { cssMap as strictCssMap } from '@atlaskit/css';
import { Popup as CompositionalPopup } from '@atlaskit/popup/compositional/popup';
import { PopupContent } from '@atlaskit/popup/compositional/popup-content';
import { PopupTrigger } from '@atlaskit/popup/compositional/popup-trigger';
import { Popup } from '@atlaskit/popup/popup';
import type { PopupComponentProps } from '@atlaskit/popup/types';
import { token } from '@atlaskit/tokens';

// `Popup`'s `xcss` takes the strict map. A fixed `width` is what the real call
// sites pass (link pickers at 464px, a session card at 240px).
const popupStyles = strictCssMap({
	fixedWidth: {
		width: '280px',
	},
	// The side-nav flyout passes a `width` and padding together.
	paddedWidth: {
		width: '280px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

const styles = cssMap({
	page: {
		position: 'relative',
		width: '100vw',
		height: '100vh',
		margin: 0,
		overflow: 'hidden',
	},
	trigger: {
		position: 'absolute',
		width: '120px',
		height: '20px',
		border: 'none',
		padding: 0,
		margin: 0,
	},
	// A custom `popupComponent` shaped like the ones in the product: it owns its
	// own elevation and keys an `overflow` branch off `shouldFitViewport`.
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	containerScrollable: {
		overflow: 'auto',
	},
	// Pushes the footer control to the bottom of the tall content.
	body: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		inlineSize: '160px',
	},
});

const CustomPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
	function CustomPopupComponent({ children, shouldFitViewport, ...props }, ref) {
		return (
			<div
				{...props}
				ref={ref}
				data-testid="fit-popup-container"
				css={[styles.container, shouldFitViewport && styles.containerScrollable]}
			>
				{children}
			</div>
		);
	},
);

/**
 * Test fixture for `Popup`'s `shouldFitViewport`, on both code paths. One popup
 * per page load, deliberately.
 *
 * Query params:
 *
 * - `fit`: `true` to enable, `false` to opt out explicitly. OMITTED leaves the
 *   prop unset, which is the only way a test can pin `Popup`'s own default.
 * - `container`: `custom` for a custom `popupComponent` instead of the default
 *   `PopoverSurface` branch
 * - `width`: `fixed` to pass `xcss` with a 280px `width` to `Popup`, `padded` to
 *   pass the same `width` with `space.200` padding
 * - `triggerBlockStart`: absolute trigger offset in px. The trigger is 120x20.
 * - `contentBlockSize`: the content's intrinsic height in px
 * - `api`: `compositional` to render the compositional `Popup`, `PopupTrigger` and
 *   `PopupContent` instead, with the padded `width`. It reads only
 *   `triggerBlockStart` and `contentBlockSize`.
 */
export default function TestingPopupFitViewport(): JSX.Element {
	const params = new URLSearchParams(window.location.search);
	const fit = params.get('fit');
	// `undefined` rather than `false` when the param is absent, so the prop is
	// genuinely unset and the adapter's own default is what renders.
	const shouldFitViewport = fit === null ? undefined : fit === 'true';
	const useCustomContainer = params.get('container') === 'custom';
	const width = params.get('width');
	const isCompositional = params.get('api') === 'compositional';
	const triggerBlockStart = Number(params.get('triggerBlockStart') ?? 0);
	const contentBlockSize = Number(params.get('contentBlockSize') ?? 400);

	const [isOpen, setIsOpen] = useState(false);

	const triggerStyle = { insetBlockStart: `${triggerBlockStart}px` };
	const toggle = () => setIsOpen((previous) => !previous);

	const renderContent = () => (
		<div
			data-testid="fit-popup-body"
			css={styles.body}
			style={{
				blockSize: `${contentBlockSize}px`,
			}}
		>
			Fitting content
			{/*
			 * A control at the very BOTTOM of the content, which is the
			 * reported symptom: uncapped, the popup grows past the viewport
			 * and this button cannot be reached. It also satisfies
			 * `scrollable-region-focusable` once the surface scrolls.
			 */}
			<button type="button" data-testid="fit-popup-footer-action">
				Confirm
			</button>
		</div>
	);

	if (isCompositional) {
		// The side-nav flyout uses this API.
		return (
			<div css={styles.page}>
				<CompositionalPopup isOpen={isOpen} role="dialog">
					<PopupTrigger>
						{(triggerProps) => (
							<button
								{...triggerProps}
								css={styles.trigger}
								style={triggerStyle}
								type="button"
								onClick={toggle}
								data-testid="fit-popup-trigger"
							>
								Open
							</button>
						)}
					</PopupTrigger>
					<PopupContent
						onClose={() => setIsOpen(false)}
						placement="bottom-end"
						testId="fit-popup"
						role="dialog"
						label="Fitting popup"
						xcss={popupStyles.paddedWidth}
						shouldRenderToParent
					>
						{renderContent}
					</PopupContent>
				</CompositionalPopup>
			</div>
		);
	}

	return (
		<div css={styles.page}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-end"
				testId="fit-popup"
				role="dialog"
				label="Fitting popup"
				shouldFitViewport={shouldFitViewport}
				popupComponent={useCustomContainer ? CustomPopupComponent : undefined}
				// Inline, not from a helper: Compiled injects the styles of the `cssMap`
				// entries it can see in the `xcss` prop.
				xcss={
					width === 'padded'
						? popupStyles.paddedWidth
						: width === 'fixed'
							? popupStyles.fixedWidth
							: undefined
				}
				trigger={(triggerProps) => (
					<button
						{...triggerProps}
						css={styles.trigger}
						style={triggerStyle}
						type="button"
						onClick={toggle}
						data-testid="fit-popup-trigger"
					>
						Open
					</button>
				)}
				content={renderContent}
				shouldRenderToParent
			/>
		</div>
	);
}
