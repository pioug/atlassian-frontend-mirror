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
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import VidFullScreenOnIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import DownloadIconLegacy from '@atlaskit/icon/glyph/download';
import VidFullScreenOffIcon from '@atlaskit/icon/glyph/vid-full-screen-off';
import { useModal } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import { Icon } from '../../../common/Icon';
import { MAX_MODAL_SIZE } from '../../constants';

import LinkInfoOld from './indexOld';
import LinkInfoButton from './link-info-button';
import { type LinkInfoProps } from './types';

const containerStyles = css({
	alignItems: 'center',
	display: 'flex',
	gap: token('space.100', '8px'),
	justifyContent: 'space-between',
	// AK ModalBody has 2px padding top and bottom.
	// Using 14px here to create 16px gap between
	// link info and iframe
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '14px',
	paddingLeft: token('space.300', '24px'),
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

const height = '20px';

const titleCss = css({
	flex: '1 1 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h3: {
		flex: '1 1 auto',
		font: token('font.heading.small'),
		fontWeight: token('font.weight.regular'),
		display: '-webkit-box',
		marginBottom: 0,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		WebkitBoxOrient: 'vertical',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: height,
		},
	},
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

const Exported = (props: LinkInfoProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <LinkInfo {...props} />;
	} else {
		return <LinkInfoOld {...props} />;
	}
};

export default Exported;
