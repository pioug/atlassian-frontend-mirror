/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

import Image from '../../src';
import Dark from '../images/dark-mode-cat.png';
import Light from '../images/light-mode-cat.png';

const containerStyles = xcss({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const imageStyles = css({
  width: '300px',
  height: 'auto',
});

const ImageThemedExample = () => {
  return (
    <Box xcss={containerStyles}>
      <Image
        css={imageStyles}
        src={Light}
        srcDark={Dark}
        alt="Theming in action"
        testId="image"
      />
    </Box>
  );
};

export default ImageThemedExample;
