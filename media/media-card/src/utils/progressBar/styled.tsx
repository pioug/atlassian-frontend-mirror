import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { borderRadius } from '@atlaskit/media-ui';

export const ProgressWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${borderRadius} z-index: 30;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.3);

  .progressBar {
    width: 0%;
    height: 3px;
    transition: width 0.25s ease-in;
    background-color: white;
  }
`;
