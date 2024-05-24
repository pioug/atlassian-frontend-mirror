import React from 'react';

import UserIcon from '@atlaskit/icon/glyph/add';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonPrimaryExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com"
      icon={UserIcon}
      label="Add new blog"
      appearance="primary"
    />
  );
};

export default LinkIconButtonPrimaryExample;
