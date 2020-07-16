import React from 'react';
import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

import { N800 } from '@atlaskit/theme/colors';

export const Content: React.ComponentClass<HTMLAttributes<{}>> = styled.div`
  & div.toolsDrawer {
    padding: 8px 16px;
    background: ${N800};

    & label {
      display: flex;
      color: white;
      align-self: center;
      padding-right: 8px;
    }

    & > div {
      /* padding: 4px 0; */
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: 13px;
  }
`;
