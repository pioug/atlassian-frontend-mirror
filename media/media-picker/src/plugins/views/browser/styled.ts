import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;
