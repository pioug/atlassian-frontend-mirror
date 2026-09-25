/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const SKILL_TITLE_PREFIX = 'skill::';

export type ParsedSkillTag = {
	color?: string;
	name: string;
	slug: string;
};

/**
 * Parses a quick-insert item title of the form `skill::{COLOR}::{SLUG}::{NAME}`, produced by the
 * Rovo skills quick-insert manifest when `display_skill_lozenge_in_editor` is enabled. Returns
 * undefined for any title that isn't in this format.
 */
export const parseSkillTagTitle = (title: string): ParsedSkillTag | undefined => {
	if (!title.startsWith(SKILL_TITLE_PREFIX)) {
		return undefined;
	}
	const [, color, slug, ...nameParts] = title.split('::');
	const name = nameParts.join('::');
	if (!slug || !name) {
		return undefined;
	}
	return { color: color || undefined, slug, name };
};

const styles = cssMap({
	// `display: inline` (not inline-block/flex) lets this element wrap across text lines like
	// normal inline content; `boxDecorationBreak: 'clone'` then gives each wrapped line fragment
	// its own independent background/padding, matching the inserted skill chip, instead of one
	// rectangle spanning every line.
	tag: {
		display: 'inline',
		boxDecorationBreak: 'clone',
		boxSizing: 'border-box',
		marginLeft: token('space.050'),
		paddingLeft: token('space.050'),
		paddingRight: token('space.050'),
		borderRadius: token('radius.xsmall'),
		backgroundColor: token('color.background.neutral'),
	},
	slash: {
		display: 'inline',
		marginRight: token('space.050'),
	},
});

// Slash accent colors for a Rovo skill, mirroring the enum used by the inserted skill chip
// (@atlassian/rovo-platform-ui-components/skills/skill-colors). Duplicated here — rather than
// imported — so this shared, product-agnostic editor package doesn't take on a dependency on an
// ai-mate/Rovo UI package. Modelled as a finite cssMap (rather than a runtime style override) so
// each color resolves to a static, ratcheted style.
const accentColorStyles = cssMap({
	LIME: { color: token('color.text.accent.lime') },
	RED: { color: token('color.text.accent.red') },
	ORANGE: { color: token('color.text.accent.orange') },
	YELLOW: { color: token('color.text.accent.yellow') },
	GREEN: { color: token('color.text.accent.green') },
	TEAL: { color: token('color.text.accent.teal') },
	BLUE: { color: token('color.text.accent.blue') },
	PURPLE: { color: token('color.text.accent.purple') },
	MAGENTA: { color: token('color.text.accent.magenta') },
	GRAY: { color: token('color.text.accent.gray') },
	DEFAULT: { color: token('color.text.subtle') },
});

type AccentColor = keyof typeof accentColorStyles;

const isAccentColor = (color?: string): color is AccentColor =>
	Boolean(color && color in accentColorStyles);

export type SkillTagLabelProps = {
	color?: string;
	slug: string;
};

/**
 * Renders a skill as a tag/chip label in the quick-insert typeahead list, instead of plain text,
 * mirroring the "/" + slug layout of the inserted skill chip (SkillTag). Never shows a hovercard
 * — this is a lightweight label for the list row, not the inserted chip.
 */
export const SkillTagLabel = ({ color, slug }: SkillTagLabelProps): JSX.Element => {
	const accentColor = isAccentColor(color) ? color : 'DEFAULT';
	return (
		<Box as="span" xcss={styles.tag}>
			<Box as="span" xcss={cx(styles.slash, accentColorStyles[accentColor])}>
				/
			</Box>
			<Text as="span">{slug}</Text>
		</Box>
	);
};
