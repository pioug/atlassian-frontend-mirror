import React from 'react';
import styled from 'styled-components';
import { Y200, P200, B300 } from '@atlaskit/theme/colors';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/media-services/document';
import ArchiveIcon from '@atlaskit/icon/glyph/media-services/zip';
import UnknownIcon from '@atlaskit/icon/glyph/media-services/unknown';
import { MediaType } from '@atlaskit/media-common';

export interface IconWrapperProps {
  type: MediaType;
}

export const mediaTypeIconColors = {
  image: Y200,
  audio: P200,
  video: '#ff7143',
  doc: B300,
  unknown: '#3dc7dc',
  archive: '',
};

export const IconWrapper = styled.div`
  display: inline-flex;
  color: ${({ type }: IconWrapperProps) =>
    mediaTypeIconColors[type] || mediaTypeIconColors.unknown};
`;

const icons = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  archive: ArchiveIcon,
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
