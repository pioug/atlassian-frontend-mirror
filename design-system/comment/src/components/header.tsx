/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type FC, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import LockFilledIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
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
	shouldHeaderWrap?: boolean;
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headingStyles = cssMap({
	root: {
		font: token('font.body'),
	},
});

const iconWrapperStyles = cssMap({
	root: {
		display: 'flex',
		paddingInline: token('space.025'),
	},
});

const headerItemStyles = cssMap({
	root: {
		whiteSpace: 'nowrap',
		flexShrink: 0,
	},
});

const authorBoxStyles = cssMap({
	root: {
		wordBreak: 'break-all',
		minWidth: '0px',
		maxWidth: '100%',
	},
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
	shouldHeaderWrap,
}) => {
	const Heading: HeadingLevel = `h${headingLevel}`;
	const shouldRender = author || time || restrictedTo || (isSaving && savingText) || edited || type;

	return shouldRender ? (
		<Heading css={headingStyles.root}>
			{shouldHeaderWrap === false ? (
				<Inline alignBlock="center" testId={testId} space="space.100" as="span" shouldWrap={false}>
					{author}
					{type && <Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge>}
					{time && !isSaving && !isError && time}
					{edited || null}
					{isSaving ? savingText : null}
					{restrictedTo && (
						<Text color="color.text.subtlest">
							<Inline alignBlock="center" space="space.050" as="span">
								&bull;
								{fg('platform-visual-refresh-icons') ? (
									<Box as="span" xcss={iconWrapperStyles.root}>
										<LockFilledIcon color="currentColor" label="" size="small" />
									</Box>
								) : (
									<LegacyLockFilledIcon size="small" label="" />
								)}
								{restrictedTo}
							</Inline>
						</Text>
					)}
				</Inline>
			) : (
				<Inline
					alignBlock="center"
					testId={testId}
					space="space.100"
					rowSpace="space.0"
					as="span"
					shouldWrap={true}
				>
					{author && (
						<Box as="span" xcss={authorBoxStyles.root}>
							{author}
						</Box>
					)}
					{type && (
						<Box as="span" xcss={headerItemStyles.root}>
							<Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge>
						</Box>
					)}
					{time && !isSaving && !isError && (
						<Box as="span" xcss={headerItemStyles.root}>
							{time}
						</Box>
					)}
					{edited && (
						<Box as="span" xcss={headerItemStyles.root}>
							{edited}
						</Box>
					)}
					{isSaving && savingText && (
						<Box as="span" xcss={headerItemStyles.root}>
							{savingText}
						</Box>
					)}
					{restrictedTo && (
						<Box as="span">
							<Text color="color.text.subtlest">
								<Inline alignBlock="center" space="space.050" as="span">
									{fg('platform-visual-refresh-icons') ? (
										<Box as="span" xcss={iconWrapperStyles.root}>
											<LockFilledIcon color="currentColor" label="" size="small" />
										</Box>
									) : (
										<LegacyLockFilledIcon size="small" label="" />
									)}
									{restrictedTo}
								</Inline>
							</Text>
						</Box>
					)}
				</Inline>
			)}
		</Heading>
	) : null;
};

Header.displayName = 'CommentHeader';

export default Header;
