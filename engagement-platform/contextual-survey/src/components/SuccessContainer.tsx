/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => (
  <section
    css={css`
      margin-left: ${token('space.500', '40px')};
    `}
  >
    <div
      css={css`
        position: absolute;
        top: ${token('space.300', '24px')};
        left: ${token('space.300', '24px')};
      `}
    >
      <CheckCircleIcon
        label=""
        aria-hidden
        primaryColor={token('color.icon.success', G300)}
      />
    </div>
    {children}
  </section>
);
