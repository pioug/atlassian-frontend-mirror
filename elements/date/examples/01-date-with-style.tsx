import React from 'react';
import { Date, DateProps } from '../src';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { borderRadius } from '@atlaskit/theme/constants';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type Props = {
  selected?: boolean;
} & DateProps;

const SelectableDate = styled(Date)`
  ${(props: Props) =>
    props.selected
      ? css`
          display: 'relative';
          &:before {
            content: '';
            border: 2px solid ${token('color.border.selected', B200)};
            display: 'absolute';
            background: transparent;
            border-radius: ${borderRadius()}px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
        `
      : null};
` as React.ComponentType<Props>;

export default () => (
  <div>
    <p>
      <SelectableDate value={586137600000} selected />
    </p>
    <p>
      <SelectableDate value={586137600000} />
    </p>
    <p>
      <SelectableDate value={586137600000} color="red" selected />
    </p>
  </div>
);
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
