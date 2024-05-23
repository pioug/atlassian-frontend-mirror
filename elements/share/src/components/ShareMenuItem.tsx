import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import { ButtonItem } from '@atlaskit/menu';
import { Box, xcss } from '@atlaskit/primitives';

const iconContainerStyles = xcss({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'size.200',
  width: 'size.200',
  borderRadius: 'border.radius',
});

export const ShareMenuItem = ({ iconName, labelId, onClickHandler }: { iconName: React.ReactNode; labelId: MessageDescriptor; onClickHandler: () => void }) => (
  <ButtonItem
    iconBefore={<IconContainer icon={iconName} />}
    onClick={onClickHandler}
  >
    <FormattedMessage {...labelId} />
  </ButtonItem>
);

export const IconContainer = ({ icon }: { icon: React.ReactNode }) => (
  <Box xcss={iconContainerStyles}>{icon}</Box>
);

export const menuWrapperWidth = '102px';
