// @ts-ignore: unused variable
// prettier-ignore
import LazilyRender, { LazilyRenderProps } from 'react-lazily-render';
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { size } from '@atlaskit/media-ui';

// We need to override the element provided by the library
// in order to make it get the parent dimensions.
export const Wrapper = styled(LazilyRender)`
  ${size()};
`;
