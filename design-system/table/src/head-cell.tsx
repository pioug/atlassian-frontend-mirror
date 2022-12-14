/* eslint-disable no-unused-vars */
/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import { TH, THProps } from './ui/th';

/**
 * __HeadCell__
 *
 * HeadCell element
 */
const Column: FC<THProps> = ({
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
      <Text color="color.text" fontWeight="500">
        {children}
      </Text>
    </TH>
  );
};

export default Column;
