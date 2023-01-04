/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Image from '../../src';
import Dark from '../images/dark-mode-cat.png';
import Light from '../images/light-mode-cat.png';

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

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Image themed example__
 *
 * An image themed example {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const ImageThemedExample = () => {
  return (
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
};

export default ImageThemedExample;
