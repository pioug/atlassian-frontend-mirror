/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Image from '../../src';
import Cat from '../images/cat.png';

const containerStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const ImageDefaultExample = () => {
  return (
    <div css={containerStyles}>
      <Image src={Cat} alt="Simple example" testId="image" />
    </div>
  );
};

export default ImageDefaultExample;
