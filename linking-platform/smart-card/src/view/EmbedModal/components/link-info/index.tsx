/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import DownloadIcon from '@atlaskit/icon/core/download';
import FullscreenExitIcon from '@atlaskit/icon/core/fullscreen-exit';
import CrossIcon from '@atlaskit/icon/core/migration/cross';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import DownloadIconLegacy from '@atlaskit/icon/glyph/download';
import VidFullScreenOffIcon from '@atlaskit/icon/glyph/vid-full-screen-off';
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

const actionCss = css({
	display: 'flex',
	flex: '0 0 auto',
	gap: token('space.050', '4px'),
	'@media only screen and (max-width: 980px)': {
		// Hide resize button if the screen is smaller than the min width
		// or too small to have enough impact to matter.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.smart-link-resize-button': {
			display: 'none',
		},
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
}: LinkInfoProps): JSX.Element => {
	const { onClose } = useModal();

	const downloadButton = useMemo(() => {
		if (onDownloadButtonClick) {
			return (
				<LinkInfoButton
					content={<FormattedMessage {...messages.download} />}
					icon={() => (
						<DownloadIcon
							label={messages.download.defaultMessage as string}
							LEGACY_fallbackIcon={DownloadIconLegacy}
							spacing="spacious"
							color="currentColor"
						/>
					)}
					label={messages.download}
					onClick={onDownloadButtonClick}
					testId={`${testId}-download`}
				/>
			);
		}
	}, [onDownloadButtonClick, testId]);

	const urlButton = useMemo(() => {
		if (onViewButtonClick) {
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
					icon={() => (
						<ShortcutIcon
							label={messages.viewOriginal.defaultMessage as string}
							spacing="spacious"
							color="currentColor"
						/>
					)}
					label={messages.viewOriginal}
					onClick={onViewButtonClick}
					testId={`${testId}-url`}
				/>
			);
		}
	}, [onViewButtonClick, providerName, testId]);

	const sizeButton = useMemo(() => {
		const isFullScreen = size === MAX_MODAL_SIZE;
		const message = isFullScreen ? messages.preview_min_size : messages.preview_max_size;
		const icon = isFullScreen ? (
			<FullscreenExitIcon
				LEGACY_fallbackIcon={VidFullScreenOffIcon}
				label={message.defaultMessage as string}
				spacing="spacious"
				color="currentColor"
			/>
		) : (
			<VidFullScreenOnIcon
				label={message.defaultMessage as string}
				spacing="spacious"
				color="currentColor"
			/>
		);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<span className="smart-link-resize-button">
				<LinkInfoButton
					content={<FormattedMessage {...message} />}
					icon={() => icon}
					label={message}
					onClick={onResizeButtonClick}
					testId={`${testId}-resize`}
				/>
			</span>
		);
	}, [onResizeButtonClick, size, testId]);

	return (
		<div css={[containerStyles]}>
			{icon && (
				<div css={iconCss} data-testid={`${testId}-icon`}>
					<Icon {...icon} />
				</div>
			)}
			<div css={[titleCss]}>
				<Heading size="small" color="color.text" testId={`${testId}-title`}>
					{title}
				</Heading>
				<span tabIndex={0} role="button" aria-hidden={true} />
			</div>
			<div css={actionCss}>
				{downloadButton}
				{urlButton}
				{sizeButton}
				{fg('navx-1483-a11y-close-button-in-modal-updates') ? (
					<Tooltip
						content={<FormattedMessage {...messages.preview_close} />}
						hideTooltipOnClick={true}
						tag="span"
						testId={`${testId}-close-tooltip`}
					>
						<CloseButton
							onClick={onClose as () => void}
							label={messages.preview_close.defaultMessage as string}
							testId={`${testId}-close-button`}
						/>
					</Tooltip>
				) : (
					<LinkInfoButton
						content={<FormattedMessage {...messages.preview_close} />}
						icon={() => (
							<CrossIcon
								label={messages.preview_close.defaultMessage as string}
								color="currentColor"
								spacing="spacious"
							/>
						)}
						label={messages.preview_close}
						onClick={onClose as () => void}
						testId={`${testId}-close`}
					/>
				)}
			</div>
		</div>
	);
};

export default LinkInfo;
