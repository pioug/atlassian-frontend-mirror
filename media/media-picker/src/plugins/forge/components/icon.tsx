import React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/image';

import { PluginIcon } from './styled';

export interface ForgeIconProps {
  iconUrl: string;
}

export const ForgeIcon = (props: ForgeIconProps) => {
  if (props.iconUrl) {
    return <PluginIcon src={props.iconUrl} />;
  } else {
    return <ImageIcon label="image-icon" />;
  }
};
