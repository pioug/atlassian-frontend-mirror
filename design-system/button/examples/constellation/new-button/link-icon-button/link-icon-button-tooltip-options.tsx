import React from 'react';

import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { LinkIconButton, type LinkIconButtonProps } from '../../../../src/new';

const tooltipOptions: LinkIconButtonProps['tooltip'] = {
  position: 'right',
  hideTooltipOnClick: true,
};

const LinkIconButtonTooltipOptionsExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com"
      icon={UserIcon}
      label="View profile"
      isTooltipDisabled={false}
      tooltip={tooltipOptions}
    />
  );
};

export default LinkIconButtonTooltipOptionsExample;
