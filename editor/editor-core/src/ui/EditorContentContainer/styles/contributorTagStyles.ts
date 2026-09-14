/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * Fade-and-rise for the contributor tags `editor-plugin-show-diff` draws above a change, plus the
 * hidden state it starts from — an inline `opacity` would outrank this rule, so both ends live here.
 *
 * Keyed on the literals the plugin writes (`CONTRIBUTOR_TAG_CLASS`,
 * `CONTRIBUTOR_TAG_REVEALED_ATTRIBUTE`), so rename in step. Keep in sync with the
 * `contributorTagStyles` entry in `EditorContentContainer-compiled.tsx`.
 *
 * Gated behind `confluence_ncs_step_diffing_version_history`, where the tags render.
 */
export const contributorTagStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-diff-contributor-tag': {
			opacity: 0,
			// Deliberately not transitioned: a tag mid-fade must not be a hit target.
			pointerEvents: 'none',
			// Starts low, so the tag reads as unfurling out of the change: the part that hangs over the
			// highlight is clipped by the tag's root, so what is seen is its bottom edge held on the
			// change while the rest rises out of it. A transform, so nothing around it reflows.
			transform: 'translateY(4px)',
			transitionProperty: 'opacity, transform',
			transitionDuration: token('motion.duration.xxlong', '600ms'),
			// The exit curve; the revealed state below swaps in the entrance curve. The fallback is
			// required — motion custom properties only exist under `html[data-theme~="motion:motion"]`,
			// and one unresolved `var()` drops the whole declaration.
			transitionTimingFunction: token(
				'motion.easing.in.practical',
				'cubic-bezier(0.6, 0, 0.8, 0.6)',
			),
			// Covers both directions, because the revealed state declares no duration of its own — one
			// there would outrank this by specificity.
			'@media (prefers-reduced-motion: reduce)': {
				transitionDuration: '0s',
			},
		},
		/**
		 * Drawn *inward*: the root's `overflow: clip`, which the reveal's `translateY` spill relies on,
		 * removes exactly the band an outline paints in. A negative offset of the ring's own width
		 * lays it just inside, where nothing can cut it.
		 *
		 * `color.border.inverse`, not `color.border.focused`: against the accent `bolder` fills the
		 * focused blue measures 1.0–1.5:1, under the 3:1 WCAG 1.4.11 asks of a focus indicator.
		 * Inverse clears 4.5:1 on all ten, which is why the label is `color.text.inverse` too.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-diff-contributor-tag:focus-visible': {
			outline: `${token('border.width.focused')} solid ${token('color.border.inverse')}`,
			outlineOffset: `calc(-1 * ${token('border.width.focused')})`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-diff-contributor-tag[data-revealed]': {
			opacity: 1,
			pointerEvents: 'auto',
			transform: 'translateY(0)',
			// The entrance curve, and deliberately nothing else: a duration here would outrank the
			// reduced-motion opt-out above.
			transitionTimingFunction: token(
				'motion.easing.out.practical',
				'cubic-bezier(0.4, 1, 0.6, 1)',
			),
			/**
			 * Start values for the first reveal, which would otherwise snap: ProseMirror attaches a
			 * widget's host only after `toDOM` returns. Both properties, or the first reveal rises
			 * without fading. Progressive enhancement — browsers without it snap that first reveal and
			 * fade every one after.
			 */
			'@starting-style': {
				opacity: 0,
				transform: 'translateY(4px)',
			},
		},
	},
});
