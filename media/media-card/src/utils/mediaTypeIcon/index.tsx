import React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/image';
import AudioIcon from '@atlaskit/icon/glyph/audio';
import ArchiveIcon from '@atlaskit/icon/glyph/media-services/zip';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/document';
import UnknownIcon from '@atlaskit/icon/glyph/page';
import { MediaType } from '@atlaskit/media-client';
import { IconWrapper } from './styled';

const icons: { [k in MediaType]: React.ComponentType<any> } = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  unknown: UnknownIcon,
  archive: ArchiveIcon,
};

export interface FileIconProps {
  type?: MediaType;
  size?: string;
  className?: string;
}

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  // TODO [BMPT-389]: Remove this and use existing MediaTypeIcon in media-ui
  render() {
    const { type, size = 'small', className } = this.props;
    const Icon = (type && icons[type]) || icons.unknown;
    return (
      <IconWrapper type={type || 'unknown'}>
        <Icon label="media-type" size={size} className={className} />
      </IconWrapper>
    );
  }
}
