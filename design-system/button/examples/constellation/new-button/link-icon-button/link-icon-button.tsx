import React from 'react';

import QuestionIcon from '@atlaskit/icon/glyph/question';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonDefaultExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com"
      icon={QuestionIcon}
      label="View help"
    />
  );
};

export default LinkIconButtonDefaultExample;
