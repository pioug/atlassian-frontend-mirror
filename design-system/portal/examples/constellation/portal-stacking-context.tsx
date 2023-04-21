/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Portal from '@atlaskit/portal';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
  marginTop: token('space.1000', '80px'),
});

const figcaptionStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
  bottom: token('space.0', '0px'),
  background: token('color.background.neutral', 'white'),
});

const figureStyles = css({
  position: 'absolute',
  border: `1px solid ${token('color.blanket', 'black')}`,
  filter: 'drop-shadow(-12px 12px 8px)',
});

const topSquareStyles = css({
  width: '372px',
  height: '482px',
  background: token('color.background.accent.purple.bolder', 'rebeccapurple'),
});

const bottomSquareStyles = css({
  width: '372px',
  height: '492px',
  background: token('color.background.accent.blue.subtler', 'lightskyblue'),
});

const topSquarePositionStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `'0px'`
  top: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  left: '256px',
});

const topSquareIndexStyles = css({
  zIndex: 1,
});

const bottomSquareIndexStyles = css({
  zIndex: 1000,
});

const PortalStackingContextExample = () => {
  return (
    <div css={containerStyles}>
      <Portal zIndex={100}>
        <figure css={[figureStyles, bottomSquareIndexStyles]}>
          <div css={bottomSquareStyles} />
          <figcaption css={figcaptionStyles}>
            I am a bottom square. I appear below because my z-index is lower. My
            child z-index is only relevant in my stacking context.
          </figcaption>
        </figure>
      </Portal>
      <Portal zIndex={200}>
        <figure
          css={[figureStyles, topSquarePositionStyles, topSquareIndexStyles]}
        >
          <div css={topSquareStyles} />
          <figcaption css={figcaptionStyles}>
            I am a top square. I appear above because my z-index is higher. My
            sibling's child z-index is only relevant in it's parent stacking
            context.
          </figcaption>
        </figure>
      </Portal>
    </div>
  );
};

export default PortalStackingContextExample;
