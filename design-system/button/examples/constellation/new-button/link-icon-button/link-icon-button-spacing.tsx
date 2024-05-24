import React from 'react';

import QuestionIcon from '@atlaskit/icon/glyph/question';
import { Inline } from '@atlaskit/primitives';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonSpacingExample = () => {
  return (
    <Inline space="space.200">
      <LinkIconButton
        href="https://atlassian.com"
        icon={QuestionIcon}
        label="View help"
      />
      <LinkIconButton
        href="https://atlassian.com"
        icon={QuestionIcon}
        spacing="compact"
        label="View help"
      />
    </Inline>
  );
};

export default LinkIconButtonSpacingExample;
