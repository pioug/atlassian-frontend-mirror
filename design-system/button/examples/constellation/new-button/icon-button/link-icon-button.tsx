import React from 'react';

import AddIcon from '@atlaskit/icon/glyph/add';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com/"
      icon={AddIcon}
      label="Create new page"
    />
  );
};

export default LinkIconButtonExample;
