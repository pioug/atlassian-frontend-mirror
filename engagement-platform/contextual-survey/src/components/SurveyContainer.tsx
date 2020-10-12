/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N0, N50 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { e500 } from '@atlaskit/theme/elevation';

import { surveyInnerWidth } from '../constants';

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

const padding: number = gridSize() * 3;

export default ({ children, onDismiss }: Props) => {
  return (
    <div
      css={css`
        background-color: ${N0};
        border-radius: ${borderRadius()}px;
        padding: ${padding}px;
        ${e500()}
        width: ${surveyInnerWidth}px;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: ${padding - gridSize()}px;
          right: ${padding - gridSize()}px;
        `}
      >
        <Button
          iconBefore={<CrossIcon label="" primaryColor={N50} />}
          aria-label="Dismiss"
          appearance="subtle"
          onClick={onDismiss}
        />
      </div>
      {children}
    </div>
  );
};
