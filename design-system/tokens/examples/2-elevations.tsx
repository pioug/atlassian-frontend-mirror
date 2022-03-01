/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/core';

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
  alignItems: 'center',
  width: '100%',
  maxWidth: '200px',
  minHeight: '100px',
  borderRadius: '3px',
  padding: '1em',
  boxSizing: 'border-box',
  textAlign: 'left',
  marginTop: '1em',
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
        color: token('color.text'),
        backgroundColor: style.surface,
        boxShadow: style.shadow,
        border: 'none',
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
