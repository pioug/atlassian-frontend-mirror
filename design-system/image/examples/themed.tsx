/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Image from '../src';

import Dark from './images/dark-mode-cat.png';
import Light from './images/light-mode-cat.png';

const containerStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const imageStyles = css({
  width: '300px',
  height: 'auto',
});

export default () => (
  <div css={containerStyles}>
    <Image
      css={imageStyles}
      src={Light}
      srcDark={Dark}
      alt="Theming in action"
      testId="image"
    />
  </div>
);
