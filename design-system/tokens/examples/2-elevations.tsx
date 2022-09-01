/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

import { setGlobalTheme, token } from '../src';

const variantStyles = {
  sunken: {
    surface: token('elevation.surface.sunken'),
    shadow: 'none',
  },
  default: {
    surface: token('elevation.surface'),
    shadow: 'none',
  },
  raised: {
    surface: token('elevation.surface.raised'),
    shadow: token('elevation.shadow.raised'),
  },
  overlay: {
    surface: token('elevation.surface.overlay'),
    shadow: token('elevation.shadow.overlay'),
  },
};

const containerStyles = css({
  margin: '2em',
});

const boxStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '200px',
  minHeight: '100px',
  marginTop: '1em',
  padding: '1em',
  alignItems: 'center',
  borderRadius: '3px',
  textAlign: 'left',
  ':hover': {
    cursor: 'pointer',
  },
});

const Box = ({
  text,
  style,
}: {
  text: string;
  style: Record<string, string>;
}) => (
  <button
    type="button"
    css={[
      boxStyles,
      css({
        backgroundColor: style.surface,
        border: 'none',
        boxShadow: style.shadow,
        color: token('color.text'),
      }),
    ]}
  >
    <AtlassianIcon label="Atlassian logo" primaryColor={style.iconColor} />
    {text}
  </button>
);

// Themes mounted to the page as css files
import '../css/atlassian-light.css';
import '../css/atlassian-dark.css';

export default () => {
  useEffect(() => {
    // If the theme has been set, dont do anything
    if (document.documentElement.dataset.theme) {
      return;
    }
    // Light theme is activated by default
    setGlobalTheme('light');
  }, []);

  return (
    <div css={containerStyles}>
      <h2>Elevations & Surfaces</h2>
      {Object.entries(variantStyles).map(([key, styles]) => (
        <Box key={key} style={styles} text={key} />
      ))}
    </div>
  );
};
