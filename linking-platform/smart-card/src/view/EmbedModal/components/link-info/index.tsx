/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import DownloadIcon from '@atlaskit/icon/core/download';
import FullscreenExitIcon from '@atlaskit/icon/core/fullscreen-exit';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import DownloadIconLegacy from '@atlaskit/icon/glyph/download';
import VidFullScreenOffIcon from '@atlaskit/icon/glyph/vid-full-screen-off';
import { useModal } from '@atlaskit/modal-dialog';

import { messages } from '../../../../messages';
import { Icon } from '../../../common/Icon';
import { MAX_MODAL_SIZE } from '../../constants';

import LinkInfoButton from './link-info-button';
import { actionCss, containerStyles, iconCss, titleCss } from './styled';
import { type LinkInfoProps } from './types';

const LinkInfo = ({
	icon,
	providerName,
	onDownloadButtonClick,
	onResizeButtonClick,
	onViewButtonClick,
	size,
	testId,
	title,
}: LinkInfoProps) => {
	const { onClose } = useModal();

	const downloadButton = useMemo(() => {
		if (onDownloadButtonClick) {
			return (
				<LinkInfoButton
					content={<FormattedMessage {...messages.download} />}
					icon={
						<DownloadIcon
							label={messages.download.defaultMessage as string}
							LEGACY_fallbackIcon={DownloadIconLegacy}
							spacing="spacious"
							color="currentColor"
						/>
					}
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
					icon={
						<ShortcutIcon
							label={messages.viewOriginal.defaultMessage as string}
							spacing="spacious"
							color="currentColor"
						/>
					}
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
					icon={icon}
					onClick={onResizeButtonClick}
					testId={`${testId}-resize`}
				/>
			</span>
		);
	}, [onResizeButtonClick, size, testId]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={containerStyles}>
			{icon && (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={iconCss} data-testid={`${testId}-icon`}>
					<Icon {...icon} />
				</div>
			)}
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={titleCss}>
				<Heading size="medium" testId={`${testId}-title`}>
					{title}
				</Heading>
				{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
				<span tabIndex={0} />
			</div>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={actionCss}>
				{downloadButton}
				{urlButton}
				{sizeButton}
				<LinkInfoButton
					content={<FormattedMessage {...messages.preview_close} />}
					icon={
						<CrossIcon
							label={messages.preview_close.defaultMessage as string}
							color="currentColor"
							spacing="spacious"
						/>
					}
					onClick={onClose as () => void}
					testId={`${testId}-close`}
				/>
			</div>
		</div>
	);
};

export default LinkInfo;
