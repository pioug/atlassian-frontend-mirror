/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { N100A, N800 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

interface ContentProps {
  testId?: string;
  isDisabled?: boolean;
}

const contentStyles = css({
  marginTop: `${gridSize() / 2}px`,
  color: token('color.text', N800),
});

const disabledStyles = css({
  color: token('color.text.disabled', N100A),
});

/**
 * __Content__
 *
 * Content of the comment.
 */
const Content: FC<ContentProps> = ({ isDisabled, testId, children }) => (
  <div data-testid={testId} css={[contentStyles, isDisabled && disabledStyles]}>
    {children}
  </div>
);

export default Content;
