/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for `shouldFitViewport`, `shouldFitContainer` and `xcss` on
 * `<Popup>`, photographed on BOTH code paths by the flag pair in
 * `src/__tests__/informational-vr-tests/popup-top-layer.vr.tsx`.
 *
 * `shouldFitViewport` had no VR coverage in either state, on a prop whose
 * top-layer implementation was `overflow: auto` on a wrapper nested inside a
 * surface that already set it: every test covering it asserted a declaration and
 * passed for months. `@atlaskit/popper` snapshots four `shouldFitViewport`
 * fixtures across the same flag pair; this file is the popup half.
 *
 * Every popup opens on the first render rather than from a `prepare` click, so
 * the snapshot cannot land mid-open, and every popup passes `autoFocus={false}`:
 * focusing into the content calls `scrollIntoView`, which scrolls the nearest
 * scroll container, and that moved the whole page on the legacy path only, so the
 * pair differed by scroll position rather than by geometry.
 *
 * The fitting fixtures hold their trigger 200px above the viewport bottom, which
 * is the space the cap binds against.
 *
 * See `@atlaskit/top-layer`'s `notes/decisions/fit-available-space.md` and
 * `notes/follow-ups/custom-popup-component-contract.md`.
 */
import { forwardRef, type ReactNode, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { cssMap as strictCssMap } from '@atlaskit/css';
import { Popup } from '@atlaskit/popup/popup';
import type { PopupComponentProps } from '@atlaskit/popup/types';
import { token } from '@atlaskit/tokens';

// `<Popup>`'s `xcss` is a `StrictXCSSProp` over padding and `width` only, so a
// surface-shaped declaration (background, radius, border) is not expressible
// through it on EITHER path. Both of the properties it does allow are passed
// here, because that combination is where the two paths part company: see
// `PopupSurfaceXcss` below. `width` is what the real call sites pass (link
// pickers at 464px, a session card at 240px).
const popupStyles = strictCssMap({
	fixedWidth: {
		width: '280px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

const styles = cssMap({
	// Exactly the viewport, and nothing here may clip: the cap's signature is the
	// popup's far edge landing 5px inside the viewport bottom, which an
	// `overflow: hidden` ancestor would erase by clipping at the same place.
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
		// NOT white, so the clearance the popup keeps at the viewport edge is a
		// visible band rather than white on white.
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	// 200px of room below the trigger, held from the viewport bottom so it does not
	// move with the device height.
	anchoredLow: {
		position: 'absolute',
		insetInlineStart: '80px',
		insetBlockEnd: '200px',
	},
	// Tight around the trigger. Legacy `shouldFitContainer` fits the popup to the
	// trigger's PARENT and the top-layer path maps it to `'match-anchor'`, the
	// trigger itself, so a parent wider than its trigger would make the pair differ
	// by that mapping rather than by the cap under test. The common call site is a
	// button that fills its parent, where the two coincide, and this box makes them
	// coincide here.
	triggerBox: {
		width: '240px',
	},
	// Roomy, because the xcss fixture is about the popup's own box and nothing
	// else.
	anchoredHigh: {
		position: 'absolute',
		insetInlineStart: '80px',
		insetBlockStart: '80px',
	},
	trigger: {
		width: '240px',
	},
	// Six 100px bands plus the footer, so the content is 640px against about 200px
	// of room below the trigger.
	tallContent: {
		display: 'flex',
		flexDirection: 'column',
	},
	// `shouldFitContainer` sizes the popup to the trigger and must not pin its own
	// width, so the width is additive: only the fixtures that own their width get
	// it. Compiled cannot extract a ternary in the `css` prop itself, so this is a
	// `&&` inside the array rather than a choice between two whole declarations.
	tallContentWidth: {
		inlineSize: '200px',
	},
	// One 100px band, labelled with the offset of its END. This is what makes the
	// pair legible: the capped half shows the first two bands and stops, and the
	// uncapped `shouldFitContainer` half shows all six running off the bottom of
	// the viewport. A blank spacer read as "a popup with an empty band" in both.
	band: {
		blockSize: '100px',
		flexShrink: 0,
		paddingBlockStart: token('space.050'),
		paddingInlineStart: token('space.100'),
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	bandAlt: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	// A SOLID bar pinned to the bottom of the scrollport, which is what makes the
	// cap legible: its position measures the scrollport's size rather than a
	// scroll position, and being solid it is ink rather than white on white. A
	// focusable control here instead would be scrolled into view by initial focus
	// on one path and not the other, so the pair would differ by scroll position
	// rather than by geometry.
	stickyFooter: {
		position: 'sticky',
		insetBlockEnd: '0',
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		textAlign: 'center',
	},
	// Ink for the xcss fixture, whose whole subject is a WIDTH. The popup is a white
	// surface on a white page, so the 32px the two paths disagree about was worth
	// only 1,081 changed pixels; a solid block that fills the content area turns the
	// same disagreement into a block of colour that is 32px wider. See
	// `@atlaskit/top-layer`'s `notes/rules/testing.md`.
	xcssInk: {
		blockSize: '64px',
		// Labelled with what is PASSED, not with a measurement: `width: 280px` lands
		// on the padded box on one path and on this inner element on the other, so
		// the rendered widths differ (280/248 on legacy, 312/280 on top-layer) and any
		// single number in the pixels would be false on one half of the pair.
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		paddingBlockStart: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	// A container shaped like the ones in the product: it owns its elevation and
	// keys an `overflow` branch off the forwarded `shouldFitViewport`.
	customContainer: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		// `popper-wrapper.tsx`'s `DefaultPopupComponent` carries this same rule, and a
		// custom `popupComponent` has to carry it itself. Without it the legacy half of
		// the pair renders Chromium's `outline: auto` ring, because that path leaves the
		// dialog container as the active element while the top-layer path does not. That
		// ring is the one thing in this frame Chromium draws from its own version-specific
		// geometry rather than from our CSS: at `border-radius: 4px` its corner arc moved
		// by a pixel between the build that recorded the first baseline and the build CI
		// runs, for 22 differing pixels and no change to the popup. Suppressing it also
		// makes the pair the parity this fixture claims.
		'&:focus': {
			outline: 'none',
		},
	},
	customContainerScrollable: {
		overflow: 'auto',
	},
});

/**
 * A custom `popupComponent` that keys its own `overflow: auto` off
 * `shouldFitViewport`, which is forwarded on the top-layer path now and was
 * dropped there before. Several in-tree containers are shaped this way.
 */
const CustomPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
	function CustomPopupComponent({ children, shouldFitViewport, ...props }, ref) {
		return (
			<div
				{...props}
				ref={ref}
				data-testid="fit-popup-container"
				css={[styles.customContainer, shouldFitViewport && styles.customContainerScrollable]}
			>
				{children}
			</div>
		);
	},
);

/**
 * The block offset at the END of each 100px band, which is what each band is
 * labelled with.
 */
const CONTENT_BANDS = ['100px', '200px', '300px', '400px', '500px', '600px'];

function TallContent({ hasOwnWidth }: { hasOwnWidth: boolean }): ReactNode {
	return (
		<div css={[styles.tallContent, hasOwnWidth && styles.tallContentWidth]}>
			{CONTENT_BANDS.map((offset, index) => (
				<div key={offset} css={[styles.band, index % 2 === 1 && styles.bandAlt]}>
					{offset}
				</div>
			))}
			<div css={styles.stickyFooter}>Footer</div>
		</div>
	);
}

/**
 * `shouldFitViewport` on the default surface: 600px of content in 200px of room,
 * so the popup is capped to the space below its trigger and scrolls, with its
 * sticky footer pinned to the bottom of the scrollport. The content is six
 * labelled 100px bands, so the frame shows which hundred the cap cuts at instead
 * of a blank band. Read the two flag states as a pair: the top-layer path has to
 * match what legacy renders, and both baselines put the popup's box at 200px
 * wide, ending 5px clear of the viewport bottom. Every flag-on baseline in this file also carries a focus ring on the
 * trigger that the flag-off one does not, because `popup-top-layer.tsx` focuses
 * the trigger when `autoFocus` is `false`.
 */
export function FitViewportDefaultSurface(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div css={styles.container}>
			<div css={[styles.anchoredLow, styles.triggerBox]}>
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					autoFocus={false}
					role="dialog"
					label="Fitting popup"
					shouldFitViewport
					testId="fit-popup"
					trigger={(triggerProps) => (
						<button
							{...triggerProps}
							type="button"
							css={styles.trigger}
							onClick={() => setIsOpen((previous) => !previous)}
							data-testid="fit-popup-trigger"
						>
							shouldFitViewport
						</button>
					)}
					content={() => <TallContent hasOwnWidth />}
				/>
			</div>
		</div>
	);
}

/**
 * The same cap reaching a custom `popupComponent`, which is the container shape
 * the six-point contract in `types.tsx` is written for: the cap arrives through
 * the host's `& > *` rule, so the container has to be the scroll container
 * itself. Its `overflow` branch reads the `shouldFitViewport` the adapter now
 * forwards.
 *
 * The container suppresses its own focus ring, which the pair needs rather than
 * merely prefers: the legacy path leaves the dialog container as the active
 * element and the top-layer path does not, so without that rule only one half of
 * the pair carries a ring, and it is a ring Chromium draws to its own geometry.
 * See `customContainer` above.
 */
export function FitViewportCustomComponent(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div css={styles.container}>
			<div css={[styles.anchoredLow, styles.triggerBox]}>
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					autoFocus={false}
					role="dialog"
					label="Fitting popup with a custom container"
					shouldFitViewport
					popupComponent={CustomPopupComponent}
					testId="fit-popup"
					trigger={(triggerProps) => (
						<button
							{...triggerProps}
							type="button"
							css={styles.trigger}
							onClick={() => setIsOpen((previous) => !previous)}
							data-testid="fit-popup-trigger"
						>
							custom container
						</button>
					)}
					content={() => <TallContent hasOwnWidth />}
				/>
			</div>
		</div>
	);
}

/**
 * Both props together, which is the `getPopupAxisSizes` cell that had only a unit
 * test: `shouldFitContainer` wins the inline axis as `'match-anchor'`, so the
 * popup is exactly the 240px trigger's width, and fitting applies to the block
 * axis alone.
 *
 * **The two halves DIVERGE, and only the top-layer one is capped.** Measured at
 * column x=200: flag-on puts the footer at y 679 to 719, capped to the space
 * below the trigger; flag-off starts at y=527 with no footer pixels in frame at
 * all, because legacy renders the full 600px and runs about 400px off the bottom
 * of the viewport. That is the symptom the fit work exists to remove.
 *
 * Legacy's own defect, not the fixture's: `popup.tsx` forces
 * `shouldRenderToParent` and `strategy: 'absolute'` under `shouldFitContainer`,
 * so popper's `maxSize` modifier computes `viewport.height - popperOffsets.y -
 * viewportPadding` from an offsetParent-relative `popperOffsets.y` (about 27)
 * instead of a viewport-relative one (about 530), giving a ~688px cap that never
 * binds. Not the fixture's wrapper either way: legacy wraps every
 * `shouldFitContainer` popup in a `position: relative` Box of its own, so that
 * Box is always the offsetParent and the cap is ~688px at any scroll position.
 * The wrapper here only puts the trigger far enough down the viewport for the
 * resulting error to show. Kept as evidence rather than reshaped for parity.
 */
export function FitContainerAndViewport(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div css={styles.container}>
			<div css={[styles.anchoredLow, styles.triggerBox]}>
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					autoFocus={false}
					role="dialog"
					label="Fitting popup matching its trigger"
					shouldFitContainer
					shouldFitViewport
					testId="fit-popup"
					trigger={(triggerProps) => (
						<button
							{...triggerProps}
							type="button"
							css={styles.trigger}
							onClick={() => setIsOpen((previous) => !previous)}
							data-testid="fit-popup-trigger"
						>
							container and viewport
						</button>
					)}
					content={() => <TallContent hasOwnWidth={false} />}
				/>
			</div>
		</div>
	);
}

/**
 * `xcss` on a standard `<Popup>`, with no `popupComponent`, carrying a `width`
 * AND padding, which is the combination no test covered: `fit-viewport.spec.tsx`
 * passes `width` alone.
 *
 * The two baselines DIVERGE, and the pair is kept as the record of it. Measured:
 * legacy renders a 280px surface with a 248px inner block, the top-layer path a
 * 312px surface with a 280px inner block. `width: 280px` lands on the padded box
 * on one path and on the inner element on the other, because `xcss` now lands on
 * a child of `PopoverSurface` where legacy applied the same declarations to a
 * border-box container. The block inside is labelled with what is PASSED for that
 * reason: any rendered number would be false on one half.
 *
 * Left as found rather than fixed here, since this change adds tests only. See
 * `@atlaskit/top-layer`'s `notes/follow-ups/popup-xcss-width-divergence.md`.
 */
export function PopupSurfaceXcss(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div css={styles.container}>
			<div css={styles.anchoredHigh}>
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					autoFocus={false}
					role="dialog"
					label="Popup with xcss"
					xcss={popupStyles.fixedWidth}
					testId="xcss-popup"
					trigger={(triggerProps) => (
						<button
							{...triggerProps}
							type="button"
							onClick={() => setIsOpen((previous) => !previous)}
							data-testid="xcss-popup-trigger"
						>
							xcss width and padding
						</button>
					)}
					content={() => <div css={styles.xcssInk}>xcss: width 280px + space.200 padding</div>}
				/>
			</div>
		</div>
	);
}

export default FitViewportDefaultSurface;
