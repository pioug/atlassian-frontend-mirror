/* eslint-disable no-unused-vars */
/** @jsx jsx */
import type { FC } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import { TH, THProps } from './ui/th';

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
        <Text color="color.text" fontWeight="medium">
          {children}
        </Text>
      )}
    </TH>
  );
};

export default HeadCell;
