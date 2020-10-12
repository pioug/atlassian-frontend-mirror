/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => (
  <section
    css={css`
      margin-left: ${gridSize() * 5}px;
    `}
  >
    <div
      css={css`
        position: absolute;
        top: ${gridSize() * 3}px;
        left: ${gridSize() * 3}px;
      `}
    >
      <CheckCircleIcon label="" aria-hidden primaryColor={G300} />
    </div>
    {children}
  </section>
);
