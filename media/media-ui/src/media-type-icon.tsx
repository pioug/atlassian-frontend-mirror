import React from 'react';
import styled from 'styled-components';
import ImageIcon from '@atlaskit/icon-file-type/glyph/image/24';
import AudioIcon from '@atlaskit/icon-file-type/glyph/audio/24';
import VideoIcon from '@atlaskit/icon-file-type/glyph/video/24';
import DocIcon from '@atlaskit/icon-file-type/glyph/document/24';
import ArchiveIcon from '@atlaskit/icon-file-type/glyph/archive/24';
import GenericIcon from '@atlaskit/icon-file-type/glyph/generic/24';

import ImageIconSmall from '@atlaskit/icon-file-type/glyph/image/16';
import AudioIconSmall from '@atlaskit/icon-file-type/glyph/audio/16';
import VideoIconSmall from '@atlaskit/icon-file-type/glyph/video/16';
import DocIconSmall from '@atlaskit/icon-file-type/glyph/document/16';
import ArchiveIconSmall from '@atlaskit/icon-file-type/glyph/archive/16';
import GenericIconSmall from '@atlaskit/icon-file-type/glyph/generic/16';
import { MediaType } from '@atlaskit/media-common';

export interface IconWrapperProps {
  type: MediaType;
}

export interface FileIconProps {
  testId?: string;
  type?: MediaType;
  size?: 'small' | 'large';
}

export const IconWrapper = styled.div`
  display: inline-flex;
  ${({ size }: { size: Required<FileIconProps['size']> }) =>
    size === 'large' ? `padding: 4px;` : ''}
`;
IconWrapper.displayName = 'IconWrapper';

const largeIcons = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  archive: ArchiveIcon,
  unknown: GenericIcon,
};

const smallIcons = {
  image: ImageIconSmall,
  audio: AudioIconSmall,
  video: VideoIconSmall,
  doc: DocIconSmall,
  archive: ArchiveIconSmall,
  unknown: GenericIconSmall,
};

const defaultType = 'unknown';

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  static defaultProps: FileIconProps = {
    type: defaultType,
    testId: 'file-type-icon',
    size: 'large',
  };

  render() {
    const { type, size, testId } = this.props;
    const typeWithDefault = type || defaultType;
    const icons = size === 'large' ? largeIcons : smallIcons;
    const Icon = icons[typeWithDefault] || icons[defaultType];

    return (
      <IconWrapper data-testid={testId} data-type={type} size={size}>
        <Icon label="media-type" />
      </IconWrapper>
    );
  }
}
