import React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/media-services/document';
import UnknownIcon from '@atlaskit/icon/glyph/media-services/unknown';
import { MediaType } from '@atlaskit/media-client';
import { IconWrapper } from './styled';

const icons = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  unknown: UnknownIcon,
};

export interface FileIconProps {
  type?: MediaType;
}

const defaultType = 'unknown';

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  static defaultProps: FileIconProps = {
    type: defaultType,
  };

  render() {
    const { type } = this.props;
    const typeWithDefault = type || defaultType;
    const Icon = icons[typeWithDefault] || icons[defaultType];

    return (
      <IconWrapper
        data-testid="media-viewer-file-type-icon"
        type={typeWithDefault}
      >
        <Icon label="media-type" size="large" />
      </IconWrapper>
    );
  }
}
