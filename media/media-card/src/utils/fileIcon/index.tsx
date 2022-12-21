/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { MediaType } from '@atlaskit/media-client';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { fileTypeIconStyles } from './styles';

export interface FileIconProps {
  mediaType?: MediaType;
  style?: any;
  iconUrl?: string;
}

const fileTypeIconClass = 'file-type-icon';

export class FileIcon extends Component<FileIconProps, {}> {
  render() {
    const { mediaType, iconUrl, style } = this.props;
    const type = mediaType || 'unknown';
    const defaultIcon = (
      <MediaTypeIcon
        type={mediaType}
        size="small"
        className={fileTypeIconClass}
      />
    );
    const icon = iconUrl ? (
      <img src={iconUrl} className="custom-icon" alt={type} />
    ) : (
      defaultIcon
    );
    return (
      <div css={fileTypeIconStyles} style={style} className={fileTypeIconClass}>
        {icon}
      </div>
    );
  }
}
