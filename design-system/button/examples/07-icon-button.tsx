import React from 'react';

import StarIcon from '@atlaskit/icon/glyph/star';

import IconButton from '../src/new-button/variants/icon/button';

export default function IconButtonExample() {
  return (
    <IconButton icon={<StarIcon label="" />}>
      I am text that a user never sees (even in the accessibility tree) as this
      currently gets overwritten in the useIconButton hook, but currently we
      still require children. see
      https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43158 for
      a fix. Icon label prop works right now, but we probably want a label prop
      on the button.
    </IconButton>
  );
}
