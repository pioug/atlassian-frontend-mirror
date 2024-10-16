/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import LegacyLockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import LockFilledIcon from '@atlaskit/icon/utility/lock-locked';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

interface HeaderProps {
	author?: ReactNode;
	restrictedTo?: ReactNode;
	isSaving?: boolean;
	savingText?: string;
	time?: ReactNode;
	type?: string;
	testId?: string;
	edited?: ReactNode;
	isError?: boolean;
	headingLevel?: '1' | '2' | '3' | '4' | '5' | '6';
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headingStyles = css({
	font: token('font.body'),
	letterSpacing: 0,
});

const iconWrapperStyles = xcss({
	display: 'flex',
	paddingInline: 'space.025',
});

/**
 * __Header items__
 *
 * Comment header items.
 *
 * @internal
 */
const Header: FC<HeaderProps> = ({
	author,
	edited,
	isError,
	isSaving,
	restrictedTo,
	savingText,
	time,
	testId,
	type,
	headingLevel = '3',
}) => {
	const Heading: HeadingLevel = `h${headingLevel}`;
	const shouldRender = author || time || restrictedTo || (isSaving && savingText) || edited || type;
	return shouldRender ? (
		<Heading css={headingStyles}>
			<Inline alignBlock="center" testId={testId} space="space.100" as="span">
				{author}
				{type && <Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge>}
				{time && !isSaving && !isError && time}
				{edited || null}
				{isSaving ? savingText : null}
				{restrictedTo && (
					<Text color="color.text.subtlest">
						<Inline alignBlock="center" space="space.050" as="span">
							&bull;
							{fg('platform-visual-refresh-icons-legacy-facade') ||
							fg('platform-visual-refresh-icons') ? (
								<Box as="span" xcss={iconWrapperStyles}>
									<LockFilledIcon color="currentColor" label="" />
								</Box>
							) : (
								// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
								<LegacyLockFilledIcon size="small" label="" />
							)}
							{restrictedTo}
						</Inline>
					</Text>
				)}
			</Inline>
		</Heading>
	) : null;
};

Header.displayName = 'CommentHeader';

export default Header;
