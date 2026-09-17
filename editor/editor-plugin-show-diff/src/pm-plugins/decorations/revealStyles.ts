import { agentBrandColorSchemes } from '@atlaskit/agent-color/agent-brand-color-schemes';
import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

import type { RevealOptions } from '../../showDiffPluginType';

import {
	buildDeletedInlineStyleStandard,
	getDeletedInlineRevealColors,
	getInsertedInlineRevealColors,
} from './colorSchemes/factory';
import { colorSchemeRegistry } from './colorSchemes/schemes';
import {
	getStandardDeletedContentStyle,
	getStandardDeletedContentStyleActive,
} from './colorSchemes/standard';
import type { ColorScheme, DiffColorScheme } from './colorSchemes/types';

/**
 * Painting strategy for reveal highlights. Highlights are `linear-gradient`s with animated
 * `background-size` for the wipe effect. Colours live on elements as custom properties so the
 * attribution palette works per-contributor.
 */

/** Marks an element as taking part in the reveal, and says which side it represents. */
export const REVEAL_ATTR = 'data-show-diff-reveal';

export type RevealRole = 'added' | 'deleted';

/** Wipe colour, read by the animation as the gradient's colour stop. */
export const REVEAL_BG_VAR = '--show-diff-reveal-bg';

/** Underline colour, brought in on the same schedule as the highlight. */
export const REVEAL_BORDER_VAR = '--show-diff-reveal-border';

/** Only schemes with background highlights can be revealed; 'traditional' uses underline only. */
const schemeSupportsReveal = (colorScheme: ColorScheme | undefined): boolean =>
	colorScheme !== 'traditional';

/** Convert a flat background colour into a wipeable gradient (zero width initially). */
export const buildWipeableBackground = (color: string): string =>
	convertToInlineCss({
		backgroundColor: 'transparent',
		backgroundImage: `linear-gradient(${color}, ${color})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: '0% 100%',
		backgroundPosition: '0 0',
		// Each line fragment of a wrapped highlight gets its own background box, so they wipe
		// together rather than the gradient stretching across the whole wrapped run.
		WebkitBoxDecorationBreak: 'clone',
		boxDecorationBreak: 'clone',
	});

/** Base padding and transparent underline placeholder (no layout shift on reveal). */
const revealBaseStyle = convertToInlineCss({
	padding: `1px 0 2px`,
	borderBottom: `2px solid transparent`,
});

const buildRevealVariables = ({
	background,
	border,
}: {
	background: string;
	border: string;
}): string =>
	convertToInlineCss({
		[REVEAL_BG_VAR]: background,
		[REVEAL_BORDER_VAR]: border,
	});

type RevealColors = { background: string; border: string };

/** Configuration that affects both resting state and reveal endpoint. */
type RevealVariant = {
	hideAddedDiffsUnderline: boolean;
	isActive: boolean;
	isInserted: boolean;
};

/** Reveal colours from the refactored scheme registry (attribution palette ready). */
const revealColorsRefactored = (
	colors: DiffColorScheme,
	{ hideAddedDiffsUnderline, isActive, isInserted }: RevealVariant,
): RevealColors =>
	isInserted
		? getInsertedInlineRevealColors(colors, isActive, hideAddedDiffsUnderline)
		: getDeletedInlineRevealColors(colors);

/**
 * Legacy cohort reveal colours. Values MUST match `revealColorsRefactored()` output for
 * `standard` scheme (test: `revealStyles.ts` in test package).
 */
const revealColorsLegacy = ({
	hideAddedDiffsUnderline,
	isActive,
	isInserted,
}: RevealVariant): RevealColors =>
	isInserted
		? {
				// Mirrors `editingStyleExtended` / `editingStyleActiveExtended` and their
				// `*NoUnderline` variants in `colorSchemes/standard.ts`.
				background: isActive
					? token('color.background.accent.purple.subtler.pressed')
					: token('color.background.accent.purple.subtlest'),
				border: hideAddedDiffsUnderline ? 'transparent' : token('color.border.accent.purple'),
			}
		: {
				// Mirrors `deletedInlineContentStyleExtended` in `colorSchemes/standard.ts`.
				background: token('color.background.accent.gray.subtlest'),
				border: token('color.border.accent.gray'),
			};

const resolveRevealColors = (colors: DiffColorScheme, variant: RevealVariant): RevealColors =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? revealColorsRefactored(colors, variant)
		: revealColorsLegacy(variant);

const getColorScheme = (colorScheme: ColorScheme | undefined): DiffColorScheme =>
	colorSchemeRegistry[colorScheme ?? 'standard'];

/** Deleted text appearance (grey and strikethrough) without the highlight. */
const deletedTextOnlyStyle = (colors: DiffColorScheme, isActive: boolean): string =>
	isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? buildDeletedInlineStyleStandard(colors, isActive ? 'active' : 'default')
		: isActive
			? getStandardDeletedContentStyleActive()
			: getStandardDeletedContentStyle();

/**
 * Resolve reveal attribute and style for a decoration. Returned style REPLACES the decoration's
 * highlight (not an addition) so the animation has something to wipe. Gate resolved in showDiff
 * command for single shared answer between decorations and animation.
 */
export const resolveRevealStyle = ({
	colorScheme,
	hideAddedDiffsUnderline = false,
	includeDeletedTextStyle = true,
	isActive,
	isInserted,
	reveal,
}: {
	colorScheme: ColorScheme | undefined;
	/**
	 * Mirrors the `showDiff` parameter of the same name. Must be threaded through: it decides
	 * whether the resting appearance has an underline, and so whether the reveal should bring one in.
	 */
	hideAddedDiffsUnderline?: boolean;
	/**
	 * Whether to supply deleted content's grey text and strikethrough. False for the deleted-content
	 * widget, which already applies its own.
	 */
	includeDeletedTextStyle?: boolean;
	isActive: boolean;
	isInserted: boolean;
	reveal: RevealOptions | undefined;
}): { role: RevealRole; style: string } | undefined => {
	if (reveal?.mode !== 'phased' || !schemeSupportsReveal(colorScheme)) {
		return undefined;
	}

	const colors = getColorScheme(colorScheme);
	const brand =
		isInserted && Object.prototype.hasOwnProperty.call(agentBrandColorSchemes, colors.insertColor)
			? agentBrandColorSchemes[colors.insertColor as AgentBrandColorScheme]
			: undefined;
	const { background, border } = resolveRevealColors(colors, {
		hideAddedDiffsUnderline,
		isActive,
		isInserted,
	});

	return {
		role: isInserted ? 'added' : 'deleted',
		style:
			(brand ? convertToInlineCss({ color: brand.text }) : '') +
			(isInserted || !includeDeletedTextStyle ? '' : deletedTextOnlyStyle(colors, isActive)) +
			revealBaseStyle +
			buildWipeableBackground(background) +
			buildRevealVariables({ background, border }),
	};
};

/** Reveal style for imperatively-built elements (deleted-content widget wrappers). */
export const applyRevealToElement = ({
	colorScheme,
	element,
	hideAddedDiffsUnderline,
	isActive,
	isInserted,
	reveal,
}: {
	colorScheme: ColorScheme | undefined;
	element: HTMLElement;
	hideAddedDiffsUnderline?: boolean;
	isActive: boolean;
	isInserted: boolean;
	reveal: RevealOptions | undefined;
}): string => {
	const resolved = resolveRevealStyle({
		colorScheme,
		hideAddedDiffsUnderline,
		isActive,
		isInserted,
		reveal,
		// The widget supplies the deleted text's own grey/strikethrough styling already.
		includeDeletedTextStyle: false,
	});

	if (!resolved) {
		return '';
	}

	element.setAttribute(REVEAL_ATTR, resolved.role);
	return resolved.style;
};
