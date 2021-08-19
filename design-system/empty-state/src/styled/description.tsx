/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { N800 } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const descriptionStyles = css({
  marginTop: 0,
  marginBottom: `${getGridSize() * 3}px`,
  color: N800,
});

/**
 * __Description__
 *
 * Description of Empty State.
 *
 * @internal
 */
const Description: FC = (props) => <p css={descriptionStyles} {...props} />;

export default Description;
