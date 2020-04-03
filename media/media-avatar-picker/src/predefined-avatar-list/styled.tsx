import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const PredefinedAvatarsWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;

  .show-more-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;

    align-items: center;
    justify-content: center;

    margin: 0;
    padding: 0;
  }
`;
