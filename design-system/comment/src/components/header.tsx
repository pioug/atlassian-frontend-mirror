/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { Inline, Text } from '@atlaskit/primitives';

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
	fontSize: '14px',
	fontWeight: 'normal',
	letterSpacing: '0',
	lineHeight: '20px',
	textTransform: 'none',
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
							<LockFilledIcon label="" size="small" />
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
