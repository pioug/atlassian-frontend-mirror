/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Bleed, Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import AppIcon from '../core/app';
import AppIconMigration from '../core/migration/app--addon';
import AppIconOld from '../glyph/addon';
import HipchatChevronDownOld from '../glyph/hipchat/chevron-down';
import ChevronDownIcon from '../utility/chevron-down';

const styles = xcss({ padding: 'space.200' });

const iconContainerStyles = xcss({
	border: '1px dashed',
	borderRadius: 'border.radius.100',
	borderColor: 'color.border.accent.magenta',
});
const bleedStyles = xcss({
	margin: 'space.050',
});

// Line height cannot be set on xcss (@atlaskit/design-system/use-latest-xcss-syntax-typography)
// and Box cannot have css prop and so 'style' prop is used to set lineHeight
const lineHeightStyles = {
	lineHeight: '0',
};

const IconContainer = ({ children }: { children: React.ReactChild }) => (
	// renders children with a surrounding box to show the icon size
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<Box xcss={iconContainerStyles} style={lineHeightStyles}>
		{children}
	</Box>
);
const dividerStyles = css({
	width: '100%',
});
const marginStyle = css({
	margin: '-4px 10px 40px 5px',
});
const LegacyIconMarginExample = () => {
	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			<Heading size="small">Icon legacy margin</Heading>

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon label="" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="none" />
				</IconContainer>
				<IconContainer>
					<AppIcon label="" spacing="spacious" />
				</IconContainer>
				New icons
			</Inline>

			<hr role="presentation" css={dividerStyles} />

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon
						label=""
						LEGACY_fallbackIcon={HipchatChevronDownOld}
						LEGACY_size="small"
						LEGACY_margin="-4px 10px 40px 5px"
					/>
				</IconContainer>
				<IconContainer>
					<AppIcon
						label=""
						spacing="none"
						LEGACY_size="small"
						LEGACY_fallbackIcon={AppIconOld}
						LEGACY_margin="-4px 10px 40px 5px"
					/>
				</IconContainer>
				<IconContainer>
					<AppIcon
						label=""
						spacing="spacious"
						LEGACY_fallbackIcon={AppIconOld}
						LEGACY_margin="-4px 10px 40px 5px"
					/>
				</IconContainer>
				New icons with legacy margin set as LEGACY_margin="-4px 10px 40px 5px" (feature flagged)
			</Inline>

			<Inline space="space.100">
				<IconContainer>
					<div css={marginStyle}>
						<HipchatChevronDownOld label="" size="small" />
					</div>
				</IconContainer>
				<IconContainer>
					<div css={marginStyle}>
						<AppIconOld label="" size="small" />
					</div>
				</IconContainer>
				<IconContainer>
					<div css={marginStyle}>
						<AppIconOld label="" />
					</div>
				</IconContainer>
				Old Icons with the margin on parent element set as "-4px 10px 40px 5px"
			</Inline>

			<hr role="presentation" css={dividerStyles} />

			<Inline space="space.100">
				<IconContainer>
					<ChevronDownIcon
						label=""
						LEGACY_fallbackIcon={HipchatChevronDownOld}
						LEGACY_size="small"
						LEGACY_margin={token('space.050')}
					/>
				</IconContainer>
				<IconContainer>
					<AppIcon
						label=""
						spacing="none"
						LEGACY_size="small"
						LEGACY_fallbackIcon={AppIconOld}
						LEGACY_margin={token('space.050')}
					/>
				</IconContainer>
				<IconContainer>
					<AppIcon
						label=""
						spacing="spacious"
						LEGACY_fallbackIcon={AppIconOld}
						LEGACY_margin={token('space.050')}
					/>
				</IconContainer>
				New icons with legacy margin set as token('space.050') (feature flagged)
			</Inline>

			<Inline space="space.100">
				<IconContainer>
					<Bleed xcss={bleedStyles}>
						<HipchatChevronDownOld label="" size="small" />
					</Bleed>
				</IconContainer>
				<IconContainer>
					<Bleed xcss={bleedStyles}>
						<AppIconMigration label="" spacing="none" LEGACY_size="small" />
					</Bleed>
				</IconContainer>
				<IconContainer>
					<Bleed xcss={bleedStyles}>
						<AppIconMigration label="" spacing="spacious" />
					</Bleed>
				</IconContainer>
				Old Icons with the margin on parent set as "space.050"
			</Inline>
		</Stack>
	);
};

export default LegacyIconMarginExample;
