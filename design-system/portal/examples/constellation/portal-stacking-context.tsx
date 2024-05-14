/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Portal from '@atlaskit/portal';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const containerStyles = xcss({
  marginBlockStart: 'space.1000',
});

const figcaptionStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
  background: token('color.background.neutral'),
  insetBlockEnd: token('space.0', '0px'),
});

const figureStyles = css({
  position: 'absolute',
  border: `1px solid ${token('color.blanket')}`,
  filter: 'drop-shadow(-12px 12px 8px)',
});

const topSquareStyles = css({
  width: '372px',
  height: '482px',
  background: token('color.background.accent.purple.bolder'),
});

const bottomSquareStyles = css({
  width: '372px',
  height: '492px',
  background: token('color.background.accent.blue.subtler'),
});

const topSquarePositionStyles = css({
  insetBlockStart: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  insetInlineStart: '256px',
});

const topSquareIndexStyles = css({
  zIndex: 1,
});

const bottomSquareIndexStyles = css({
  zIndex: 1000,
});

const PortalStackingContextExample = () => {
  return (
    <Box xcss={containerStyles}>
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
    </Box>
  );
};

export default PortalStackingContextExample;
