/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type MouseEvent } from 'react';

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/media-ui/messages';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from '../../insetViewerContext';
import type { Children } from './styleWrappers';

const archiveDownloadButtonWrapperStyles = css({
	paddingTop: `${token('space.100')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '7px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '5px',
	paddingLeft: `${token('space.100')}`,
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	backgroundColor: 'transparent',
	color: token('color.icon'),
	'&:hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.pressed'),
		transition: token('motion.button.pressed'),
	},
	transition: token('motion.button.hovered'),
});

const archiveDownloadButtonMotionStyles = css({
	transition: token('motion.button.hovered'),
	'&:active': {
		transition: token('motion.button.pressed'),
	},
});

const archiveDownloadButtonWrapperStyleFix = css({
	all: 'unset',
	display: 'block',
	'&:focus-visible': {
		outlineOffset: token('space.025'),
		outlineWidth: token('border.width.focused'),
		outlineColor: token('color.border.focused'),
		outlineStyle: 'solid',
	},
});

// The row around the button owns the padding and the hover in the inset viewer.
const insetViewerArchiveDownloadButtonWrapperStyles = css({
	paddingTop: token('space.0'),
	paddingRight: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.0'),
	'&:hover': {
		backgroundColor: 'transparent',
	},
	'&:active': {
		backgroundColor: 'transparent',
	},
});

type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArchiveDownloadButtonWrapper = ({
	children,
	onClick,
}: Children & OnClick): JSX.Element => {
	const intl = useIntl();
	const isInsetViewer = useIsInsetViewer();
	return (
		<button
			aria-label={intl.formatMessage(messages.archive_download_label_assistive_text)}
			css={[
				archiveDownloadButtonWrapperStyleFix,
				archiveDownloadButtonWrapperStyles,
				archiveDownloadButtonMotionStyles,
				isInsetViewer && insetViewerArchiveDownloadButtonWrapperStyles,
			]}
			onClick={(event) => onClick && onClick(event as unknown as React.MouseEvent<HTMLDivElement>)}
			data-testid="media-archiveDownloadButton"
		>
			{children}
		</button>
	);
};
