/**@jsx jsx */

import { jsx } from '@emotion/react';

import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const message = 'Anyone can view';

export default () => (
  <div
    css={{
      maxWidth: '100%',
      lineHeight: `${token('space.500', '40px')}`,
      color: `${token('color.text.subtle', N300)}`,
    }}
  >
    <span
      css={{
        position: 'relative',
        bottom: `${token('space.050', '4px')}`,
      }}
    >
      {message}
    </span>
    <UnlockIcon size="medium" label={message} />
  </div>
);
