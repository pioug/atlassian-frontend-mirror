/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl';

import Heading from '@atlaskit/heading';
import DownloadIcon from '@atlaskit/icon/core/download';
import VidFullScreenOnIcon from '@atlaskit/icon/core/fullscreen-enter';
import FullscreenExitIcon from '@atlaskit/icon/core/fullscreen-exit';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
import { CloseButton, useModal } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../../../../messages';
import { Icon } from '../../../common/Icon';
import { MAX_MODAL_SIZE } from '../../constants';

import LinkInfoButton from './link-info-button';
import { type LinkInfoProps } from './types';

const containerStyles = css({
	display: 'flex',
	paddingLeft: token('space.300'),
	paddingRight: token('space.300'),
	paddingTop: token('space.300'),
	paddingBottom: token('space.200'),
	gap: token('space.100'),
	alignSelf: 'stretch',
	height: '24px',
});

const iconSize = '24px';

// EDM-7328: CSS Specificity
// An embed modal icon css for img, span, svg has specificity weight of 0-1-1.
// Specify flex ui icon selector to increase specificity weight to 0-2-1.
const iconCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&, [data-smart-element-icon] img, [data-smart-element-icon] span, [data-smart-element-icon] svg, img, span, svg':
		{
			height: iconSize,
			minHeight: iconSize,
			maxHeight: iconSize,
			width: iconSize,
			minWidth: iconSize,
			maxWidth: iconSize,
		},
});

const titleCss = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	flex: '1 0 0',
	alignSelf: 'stretch',
});

const buttonGroupCss = css({
	display: 'flex',
	flex: '0 0 auto',
	gap: token('space.050'),
	listStyle: 'none',
	marginTop: token('space.0'),
	marginRight: token('space.0'),
	marginBottom: token('space.0'),
	marginLeft: token('space.0'),
	marginBlockStart: token('space.0'),
	marginBlockEnd: token('space.0'),
	paddingTop: token('space.0'),
	paddingRight: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const listItemCSS = css({
	alignItems: 'center',
	marginTop: 0,
});

const resizeButtonCss = css({
	'@media only screen and (max-width: 980px)': {
		// Hide resize button if the screen is smaller than the min width
		// or too small to have enough impact to matter.
		display: 'none',
	},
});

const LinkInfo = ({
	icon,
	providerName,
	onDownloadButtonClick,
	onResizeButtonClick,
	onViewButtonClick,
	size,
	testId,
	title,
	focusRef,
}: LinkInfoProps): JSX.Element => {
	const { onClose } = useModal();
	const { formatMessage } = useIntl();

	const downloadButton = useMemo(
		() => (
			<LinkInfoButton
				content={<FormattedMessage {...messages.download} />}
				icon={() => <DownloadIcon label="" spacing="spacious" color="currentColor" />}
				label={formatMessage(messages.download)}
				onClick={onDownloadButtonClick}
				testId={`${testId}-download`}
				{...(fg('navx-4719-a11y-embed-modal-focus-states') ? { focusRef } : {})}
			/>
		),
		[onDownloadButtonClick, testId, formatMessage, focusRef],
	);

	const urlButton = useMemo(() => {
		if (onViewButtonClick) {
			const label = providerName
				? formatMessage(messages.viewInProvider, { providerName })
				: formatMessage(messages.viewOriginal);
			const content = providerName ? (
				<React.Fragment>
					<FormattedMessage {...messages.viewIn} /> {providerName}
				</React.Fragment>
			) : (
				<FormattedMessage {...messages.viewOriginal} />
			);
			return (
				<LinkInfoButton
					content={content}
					icon={() => <ShortcutIcon label="" spacing="spacious" color="currentColor" />}
					label={label}
					onClick={onViewButtonClick}
					testId={`${testId}-url`}
					role={'link'}
					{...(fg('navx-4719-a11y-embed-modal-focus-states')
						? { focusRef: !onDownloadButtonClick ? focusRef : undefined }
						: {})}
				/>
			);
		}
	}, [onViewButtonClick, providerName, testId, formatMessage, onDownloadButtonClick, focusRef]);

	const sizeButton = useMemo(() => {
		const isFullScreen = size === MAX_MODAL_SIZE;
		const message = isFullScreen ? messages.preview_min_size : messages.preview_max_size;
		const icon = isFullScreen ? (
			<FullscreenExitIcon label="" spacing="spacious" color="currentColor" />
		) : (
			<VidFullScreenOnIcon label="" spacing="spacious" color="currentColor" />
		);

		return (
			<LinkInfoButton
				content={<FormattedMessage {...message} />}
				icon={() => icon}
				label={formatMessage(message)}
				onClick={onResizeButtonClick}
				testId={`${testId}-resize`}
			/>
		);
	}, [onResizeButtonClick, size, testId, formatMessage]);

	return (
		<div css={[containerStyles]}>
			{icon && (
				<div css={iconCss} data-testid={`${testId}-icon`}>
					<Icon {...icon} />
				</div>
			)}
			<div css={[titleCss]}>
				<Heading as="h2" size="small" color="color.text" testId={`${testId}-title`}>
					{title}
				</Heading>
			</div>
			<ul role="list" css={buttonGroupCss}>
				{onDownloadButtonClick && <li css={listItemCSS}>{downloadButton}</li>}
				<li css={listItemCSS}>{urlButton}</li>
				<li css={[listItemCSS, resizeButtonCss]}>{sizeButton}</li>
				<li css={listItemCSS}>
					<Tooltip
						content={<FormattedMessage {...messages.preview_close} />}
						hideTooltipOnClick={true}
						tag="span"
						testId={`${testId}-close-tooltip`}
					>
						<CloseButton
							onClick={onClose as () => void}
							label={formatMessage(messages.preview_close)}
							testId={testId}
						/>
					</Tooltip>
				</li>
			</ul>
		</div>
	);
};

export default LinkInfo;
