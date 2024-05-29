/** @jsx jsx */
import { type CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';

import { CURRENT_SURFACE_CSS_VAR, token } from '../src';

const boxStyles = css({
  margin: 20,
  padding: 20,
  border: '1px solid',
  borderColor: token('color.border.bold'),
});

const currentSurfaceStyles = css({
  backgroundColor: token('utility.elevation.surface.current'),
});

const SurfaceAwareBox = () => (
  <div css={[boxStyles, currentSurfaceStyles]}>
    This box uses the current surface value.
  </div>
);

export default () => {
  return (
    <div>
      <div
        css={boxStyles}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        style={
          {
            [CURRENT_SURFACE_CSS_VAR]: token('color.background.success'),
            backgroundColor: token('color.background.success'),
          } as CSSProperties
        }
      >
        <p>This box sets the current surface value.</p>
        <div
          css={boxStyles}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          style={
            {
              [CURRENT_SURFACE_CSS_VAR]: token('color.background.warning'),
              backgroundColor: token('color.background.warning'),
            } as CSSProperties
          }
        >
          <p>This box sets the current surface value.</p>
          <SurfaceAwareBox />
        </div>
        <div
          css={boxStyles}
          style={{
            backgroundColor: token('color.background.information'),
          }}
        >
          <p>This box does not set the current surface value.</p>
          <SurfaceAwareBox />
        </div>
      </div>
      <SurfaceAwareBox />
    </div>
  );
};
