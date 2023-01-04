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

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Image default example__
 *
 * An image default example {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const ImageDefaultExample = () => {
  return (
    <div css={containerStyles}>
      <Image src={Cat} alt="Simple example" testId="image" />
    </div>
  );
};

export default ImageDefaultExample;
