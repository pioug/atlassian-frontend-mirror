/* eslint-disable no-unused-vars */
/** @jsx jsx */
import type { FC } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { TH, type THProps } from './ui/th';

/**
 * __HeadCell__
 *
 * HeadCell element
 */
const HeadCell: FC<THProps> = ({
  children,
  align,
  testId,
  backgroundColor,
  scope = 'col',
}) => {
  return (
    <TH
      scope={scope}
      align={align}
      testId={testId}
      backgroundColor={backgroundColor}
    >
      {children && (
        // migrate to <Text />
        <span
          style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            color: token('color.text', '#172B4D'),
            /* @ts-ignore migrate to Text */
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            fontWeight: token('font.weight.medium', '500'),
          }}
        >
          {children}
        </span>
      )}
    </TH>
  );
};

export default HeadCell;
