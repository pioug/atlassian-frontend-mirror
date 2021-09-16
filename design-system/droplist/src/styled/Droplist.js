import styled, { css } from 'styled-components';

import { backgroundOnLayer, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

/* When dropdown contains more than 9 elements (droplist items, droplist groups),
 * it should have scroll and cut off half of the 10th item to indicate that there are more
 * items then are seen. This was previously calculated by mapping over children, but with
 * the current composed API it is simpler to just assume 9 items. */
const getMaxHeight = ({ isTall, maxHeight }) => {
  if (maxHeight) return `${maxHeight}px`;

  const heightWithoutPadding = 17;
  const verticalPadding = gridSize();
  const height = heightWithoutPadding + verticalPadding * 2;
  const defaultMaxHeight = 9.5 * height + verticalPadding / 2;
  return isTall ? '90vh' : `${defaultMaxHeight}px`;
};

export default styled.div`
  display: inline-flex;

  ${(props) =>
    props.fit &&
    `
    display: block;
    flex: 1 1 auto;
  `};
`;

const backgroundColor = backgroundOnLayer;
const boxShadow = css`
  box-shadow: 0 ${gridSize() / 2}px ${gridSize}px -${gridSize() / 4}px ${N50A},
    0 0 1px ${N60A};
`;

export const Content = styled.div`
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  ${boxShadow};
  box-sizing: border-box;
  overflow: auto;
  padding: ${gridSize() / 2}px 0;
  max-height: ${getMaxHeight};
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  min-width: ${gridSize() * 20}px;
  padding: ${gridSize() * 2.5}px;
`;

export const Trigger = styled.div`
  display: inline-flex;
  transition-duration: 0.2s;
  transition: box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);

  ${(props) =>
    props.fit &&
    `
    box-sizing: border-box;
    display: block;
  `};
`;
