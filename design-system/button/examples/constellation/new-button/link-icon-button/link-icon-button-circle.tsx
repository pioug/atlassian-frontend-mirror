import React from 'react';

import QuestionIcon from '@atlaskit/icon/glyph/question';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonCircleExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com"
      shape="circle"
      icon={QuestionIcon}
      label="View help"
    />
  );
};

export default LinkIconButtonCircleExample;
