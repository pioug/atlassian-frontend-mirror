/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

import { setGlobalTheme, token } from '../src';

const nonInteractiveStyles = {
  sunken: {
    label: 'elevation.surface.sunken',
    surface: token('elevation.surface.sunken'),
    shadow: 'none',
  },
};
const interactiveBackgroundStyles = {
  default: {
    label: 'elevation.surface',
    surface: token('elevation.surface'),
    surfaceHovered: token('elevation.surface.hovered'),
    surfacePressed: token('elevation.surface.pressed'),
    shadow: 'none',
  },
  defaultOutline: {
    label: 'elevation.surface (with border)',
    surface: token('elevation.surface'),
    surfaceHovered: token('elevation.surface.hovered'),
    surfacePressed: token('elevation.surface.pressed'),
    shadow: 'none',
    border: token('color.border'),
  },
  raised: {
    label: 'elevation.surface.raised',
    surface: token('elevation.surface.raised'),
    surfaceHovered: token('elevation.surface.raised.hovered'),
    surfacePressed: token('elevation.surface.raised.pressed'),
    shadow: token('elevation.shadow.raised'),
  },
  overlay: {
    label: 'elevation.surface.overlay',
    surface: token('elevation.surface.overlay'),
    surfaceHovered: token('elevation.surface.overlay.hovered'),
    surfacePressed: token('elevation.surface.overlay.pressed'),
    shadow: token('elevation.shadow.overlay'),
  },
};

const interactiveElevationStyles = {
  default: {
    label: 'elevation.surface',
    surface: token('elevation.surface'),
    surfaceHovered: token('elevation.surface.overlay'),
    surfacePressed: token('elevation.surface.raised'),
    shadow: 'none',
    shadowHovered: token('elevation.shadow.overlay'),
    shadowPressed: token('elevation.shadow.raised'),
  },
  defaultOutline: {
    label: 'elevation.surface (with border)',
    surface: token('elevation.surface'),
    surfaceHovered: token('elevation.surface.overlay'),
    surfacePressed: token('elevation.surface.raised'),
    border: token('color.border'),
    shadow: 'none',
    shadowHovered: token('elevation.shadow.overlay'),
    shadowPressed: token('elevation.shadow.raised'),
  },
  raised: {
    label: 'elevation.surface.raised',
    surface: token('elevation.surface.raised'),
    surfaceHovered: token('elevation.surface.overlay'),
    surfacePressed: token('elevation.surface.raised'),
    shadow: token('elevation.shadow.raised'),
    shadowHovered: token('elevation.shadow.overlay'),
    shadowPressed: token('elevation.shadow.raised'),
  },
};

const containerStyles = css({
  padding: '2em',
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
  // eslint-disable-next-line
  borderRadius: token('border.radius.100', '3px'),
  textAlign: 'left',
  transition: 'box-shadow 200ms, background 200ms, border 200ms',
});

const Box = ({
  text,
  style,
}: {
  text: string;
  style: Record<string, string>;
}) => {
  const isInteractive = style.surfacePressed || style.shadowPressed;
  const ComponentType = isInteractive ? 'button' : 'div';
  return (
    <ComponentType
      css={[
        boxStyles,
        css({
          backgroundColor: style.surface,
          border: style.border ? `1px solid ${style.border}` : 'none',
          boxShadow: style.shadow,
          color: token('color.text'),
          cursor: isInteractive ? 'pointer' : 'default',
          ':hover': {
            backgroundColor: style.surfaceHovered || style.surface,
            boxShadow: style.shadowHovered || style.shadow,
          },
          ':active': {
            backgroundColor: style.surfacePressed || style.surface,
            boxShadow: style.shadowPressed || style.shadow,
          },
        }),
      ]}
    >
      <AtlassianIcon label="Atlassian logo" primaryColor={style.iconColor} />
      {text}
    </ComponentType>
  );
};

export default () => {
  useEffect(() => {
    // If the theme has been set, dont do anything
    if (document.documentElement.dataset.theme) {
      return;
    }
    // Light theme is activated by default
    setGlobalTheme({ colorMode: 'light' });
  }, []);

  return (
    <div css={containerStyles}>
      <h2>Elevations & Surfaces</h2>
      <h3>Non-interactive surfaces</h3>
      {Object.entries(nonInteractiveStyles).map(([key, styles]) => (
        <Box key={key} style={styles} text={styles.label || key} />
      ))}
      <h3>Interactive elevations (approach 1: background change)</h3>
      {Object.entries(interactiveBackgroundStyles).map(([key, styles]) => (
        <Box key={key} style={styles} text={styles.label || key} />
      ))}
      <h3>Interactive elevations (approach 2: elevation change)</h3>
      {Object.entries(interactiveElevationStyles).map(([key, styles]) => (
        <Box key={key} style={styles} text={styles.label || key} />
      ))}
    </div>
  );
};
