/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/core';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

import { setGlobalTheme, token } from '../src';

const variantStyles = {
  blue: {
    default: {
      color: token('color.text.accent.blue'),
      backgroundColor: token('color.background.accent.blue.subtler'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: token('color.icon.accent.blue'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.blue.subtle'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  red: {
    default: {
      color: token('color.text.accent.red'),
      backgroundColor: token('color.background.accent.red.subtler'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: token('color.icon.accent.red'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.red.subtle'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  orange: {
    default: {
      color: token('color.text.accent.orange'),
      backgroundColor: token('color.background.accent.orange.subtler'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: token('color.icon.accent.orange'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.orange.subtle'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  yellow: {
    default: {
      color: token('color.text.accent.yellow'),
      backgroundColor: token('color.background.accent.yellow.subtler'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: token('color.icon.accent.yellow'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.yellow.subtle'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  green: {
    default: {
      color: token('color.text.accent.green'),
      backgroundColor: token('color.background.accent.green.subtler'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: token('color.icon.accent.green'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.green.subtle'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  teal: {
    default: {
      color: token('color.text.accent.teal'),
      backgroundColor: token('color.background.accent.teal.subtler'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: token('color.icon.accent.teal'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.teal.subtle'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  purple: {
    default: {
      color: token('color.text.accent.purple'),
      backgroundColor: token('color.background.accent.purple.subtler'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: token('color.icon.accent.purple'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.purple.subtle'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  magenta: {
    default: {
      color: token('color.text.accent.magenta'),
      backgroundColor: token('color.background.accent.magenta.subtler'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: token('color.icon.accent.magenta'),
    },
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.magenta.subtle'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
};

const containerStyles = css({
  margin: '2em',
});

const rowStyles = css({
  display: 'flex',
  gap: '1em',
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
        color: style.color,
        backgroundColor: style.backgroundColor,
        border: style.border,
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
      <h2>Accent tokens</h2>
      <p>
        For use with user-generated colors, graphs/charts and when there is no
        meaning tied to the color.
      </p>
      {Object.entries(variantStyles).map(([key, subVariantStyles]) => (
        <div key={key} css={rowStyles}>
          {Object.entries(subVariantStyles).map(([subKey, styles]) => (
            <Box key={key + subKey} style={styles} text={`${key}.${subKey}`} />
          ))}
        </div>
      ))}
    </div>
  );
};
