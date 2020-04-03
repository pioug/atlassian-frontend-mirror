import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';
import { N100A, DN90A } from '@atlaskit/theme/colors';

// NOTE:
// we can't use @atlaskit/blanket
// because it has to sit on top of other layered elements (i.e. Modal).

const backgroundColor = themed({ light: N100A, dark: DN90A });

// IE11 and Edge: z-index needed because fixed position calculates z-index relative
// to body instead of nearest stacking context (Portal in our case).
export default styled.div<{ isTinted?: boolean }>`
  background: ${p => (p.isTinted ? backgroundColor : 'transparent')};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 220ms;
  z-index: ${layers.spotlight};
`;
