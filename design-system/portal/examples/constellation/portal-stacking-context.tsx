/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Image from '@atlaskit/image';
import Portal from '@atlaskit/portal';
import { token } from '@atlaskit/tokens';

import firstDog from './images/dog-one.png';
import secondDog from './images/dog-two.png';

const containerStyles = css({
  marginTop: token('space.1000', '80px'),
});

const figcaptionStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
  bottom: 0,
  background: token('color.background.neutral', 'white'),
});

const dogStyles = css({
  position: 'absolute',
  border: `1px solid ${token('color.blanket', 'black')}`,
  filter: 'drop-shadow(-12px 12px 8px)',
});

const topDogPositionStyles = css({
  top: '0px',
  left: '256px',
});

const topDogIndexStyles = css({
  zIndex: 1,
});

const bottomDogIndexStyles = css({
  zIndex: 1000,
});

const PortalStackingContextExample = () => {
  return (
    <div css={containerStyles}>
      <Portal zIndex={100}>
        <figure css={[dogStyles, bottomDogIndexStyles]}>
          <Image src={secondDog} alt="A grey dog face." />
          <figcaption css={figcaptionStyles}>
            I am a gray dog. I appear below because my z-index is lower. My
            child z-index is only relevant in my stacking context.
          </figcaption>
        </figure>
      </Portal>
      <Portal zIndex={200}>
        <figure css={[dogStyles, topDogPositionStyles, topDogIndexStyles]}>
          <Image src={firstDog} alt="A brown dog face." />
          <figcaption css={figcaptionStyles}>
            I am a brown dog. I appear above because my z-index is higher. My
            sibling's child z-index is only relevant in it's parent stacking
            context.
          </figcaption>
        </figure>
      </Portal>
    </div>
  );
};

export default PortalStackingContextExample;
