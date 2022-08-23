/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { useModal } from '@atlaskit/modal-dialog';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VidFullScreenOffIcon from '@atlaskit/icon/glyph/vid-full-screen-off';
import { Icon } from '../../../common/Icon';
import { messages } from '../../../../messages';
import { MAX_MODAL_SIZE } from '../../constants';
import { LinkInfoProps } from './types';
import LinkInfoButton from './link-info-button';
import { actionCss, containerStyles, iconCss, titleCss } from './styled';

const LinkInfo: React.FC<LinkInfoProps> = ({
  downloadUrl,
  icon,
  providerName,
  onDownloadButtonClick,
  onResizeButtonClick,
  onViewButtonClick,
  size,
  testId,
  title,
  url,
}) => {
  const { onClose } = useModal();

  const downloadButton = useMemo(() => {
    if (downloadUrl) {
      return (
        <LinkInfoButton
          content={<FormattedMessage {...messages.download} />}
          href={downloadUrl}
          icon={
            <DownloadIcon label={messages.download.defaultMessage as string} />
          }
          onClick={onDownloadButtonClick}
          testId={`${testId}-download`}
        />
      );
    }
  }, [downloadUrl, onDownloadButtonClick, testId]);

  const urlButton = useMemo(() => {
    if (url) {
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
          href={url}
          icon={
            <ShortcutIcon
              label={messages.viewOriginal.defaultMessage as string}
            />
          }
          onClick={onViewButtonClick}
          target="_blank"
          testId={`${testId}-url`}
        />
      );
    }
  }, [onViewButtonClick, providerName, testId, url]);

  const sizeButton = useMemo(() => {
    const isFullScreen = size === MAX_MODAL_SIZE;
    const message = isFullScreen
      ? messages.preview_min_size
      : messages.preview_max_size;
    const icon = isFullScreen ? (
      <VidFullScreenOffIcon label={message.defaultMessage as string} />
    ) : (
      <VidFullScreenOnIcon label={message.defaultMessage as string} />
    );
    return (
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
    <div css={containerStyles}>
      {icon && (
        <div css={iconCss} data-testid={`${testId}-icon`}>
          <Icon {...icon} />
        </div>
      )}
      <div css={titleCss}>
        <h3 data-testid={`${testId}-title`}>{title}</h3>
        <span tabIndex={0} />
      </div>
      <div css={actionCss}>
        {downloadButton}
        {urlButton}
        {sizeButton}
        <LinkInfoButton
          content={<FormattedMessage {...messages.preview_close} />}
          icon={
            <CrossIcon
              label={messages.preview_close.defaultMessage as string}
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
