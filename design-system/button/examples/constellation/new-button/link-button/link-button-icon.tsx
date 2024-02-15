// External links supplied to the `href` prop automatically apply appropriate attributes, such as `target="_blank"` or `rel="noopener noreferrer"`, to ensure they open in new windows.
// Both target and rel attributes can still be overridden by specifying them separately.

import React from 'react';

import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { LinkButton } from '../../../../src/new';

const LinkButtonIconExample = () => {
  return (
    <LinkButton iconAfter={ShortcutIcon} href="https://atlassian.com/">
      Link button
    </LinkButton>
  );
};

export default LinkButtonIconExample;
