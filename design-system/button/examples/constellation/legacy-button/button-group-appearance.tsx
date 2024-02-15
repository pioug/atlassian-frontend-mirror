import React from 'react';

import EmailIcon from '@atlaskit/icon/glyph/email';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';

import Button, { ButtonGroup } from '../../../src';

const ButtonGroupAppearanceExample = () => {
  return (
    <ButtonGroup appearance="primary" label="Button group with appearance">
      <Button iconBefore={<EmailIcon label="" size="medium" />}>
        Contact HR
      </Button>
      <Button iconBefore={<FeedbackIcon label="" size="medium" />}>
        Feedback
      </Button>
      <Button iconBefore={<EmojiAtlassianIcon label="" size="medium" />}>
        Request IT Support
      </Button>
    </ButtonGroup>
  );
};

export default ButtonGroupAppearanceExample;
