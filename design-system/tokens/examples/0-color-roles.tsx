/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/core';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

import { setGlobalTheme, token } from '../src';

const variantStyles = {
  brand: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.brand.bold'),
      border: `1px solid ${token('color.border.brand')}`,
      hoverBackgroundColor: token('color.background.brand.bold.hovered'),
      activeBackgroundColor: token('color.background.brand.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text.brand'),
      backgroundColor: token('color.background.brand'),
      border: `1px solid ${token('color.border.brand')}`,
      hoverBackgroundColor: token('color.background.brand.hovered'),
      activeBackgroundColor: token('color.background.brand.pressed'),
      iconColor: token('color.icon.brand'),
    },
  },
  information: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.information.bold'),
      border: `1px solid ${token('color.border.information')}`,
      hoverBackgroundColor: token('color.background.information.bold.hovered'),
      activeBackgroundColor: token('color.background.information.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text.information'),
      backgroundColor: token('color.background.information'),
      border: `1px solid ${token('color.border.information')}`,
      hoverBackgroundColor: token('color.background.information.hovered'),
      activeBackgroundColor: token('color.background.information.pressed'),
      iconColor: token('color.icon.information'),
    },
  },
  neutral: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.neutral.bold'),
      border: `1px solid ${token('color.border.neutral')}`,
      hoverBackgroundColor: token('color.background.neutral.bold.hovered'),
      activeBackgroundColor: token('color.background.neutral.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text'),
      backgroundColor: token('color.background.neutral'),
      border: `1px solid ${token('color.border.neutral')}`,
      hoverBackgroundColor: token('color.background.neutral.hovered'),
      activeBackgroundColor: token('color.background.neutral.pressed'),
      iconColor: token('color.icon'),
    },
    subtle: {
      color: token('color.text'),
      backgroundColor: token('color.background.neutral.subtle'),
      border: `1px solid ${token('color.border')}`,
      hoverBackgroundColor: token('color.background.neutral.subtle.hovered'),
      activeBackgroundColor: token('color.background.neutral.subtle.pressed'),
      iconColor: token('color.icon'),
    },
  },
  success: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.success.bold'),
      border: `1px solid ${token('color.border.success')}`,
      hoverBackgroundColor: token('color.background.success.bold.hovered'),
      activeBackgroundColor: token('color.background.success.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text.success'),
      backgroundColor: token('color.background.success'),
      border: `1px solid ${token('color.border.success')}`,
      hoverBackgroundColor: token('color.background.success.hovered'),
      activeBackgroundColor: token('color.background.success.pressed'),
      iconColor: token('color.icon.success'),
    },
  },
  danger: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.danger.bold'),
      border: `1px solid ${token('color.border.danger')}`,
      hoverBackgroundColor: token('color.background.danger.bold.hovered'),
      activeBackgroundColor: token('color.background.danger.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text.danger'),
      backgroundColor: token('color.background.danger'),
      border: `1px solid ${token('color.border.danger')}`,
      hoverBackgroundColor: token('color.background.danger.hovered'),
      activeBackgroundColor: token('color.background.danger.pressed'),
      iconColor: token('color.icon.danger'),
    },
  },
  warning: {
    bold: {
      color: token('color.text.warning.inverse'),
      backgroundColor: token('color.background.warning.bold'),
      border: `1px solid ${token('color.border.warning')}`,
      hoverBackgroundColor: token('color.background.warning.bold.hovered'),
      activeBackgroundColor: token('color.background.warning.bold.pressed'),
      iconColor: token('color.icon.warning.inverse'),
    },
    default: {
      color: token('color.text.warning'),
      backgroundColor: token('color.background.warning'),
      border: `1px solid ${token('color.border.warning')}`,
      hoverBackgroundColor: token('color.background.warning.hovered'),
      activeBackgroundColor: token('color.background.warning.pressed'),
      iconColor: token('color.icon.warning'),
    },
  },
  discovery: {
    bold: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.discovery.bold'),
      border: `1px solid ${token('color.border.discovery')}`,
      hoverBackgroundColor: token('color.background.discovery.bold.hovered'),
      activeBackgroundColor: token('color.background.discovery.bold.pressed'),
      iconColor: token('color.icon.inverse'),
    },
    default: {
      color: token('color.text.discovery'),
      backgroundColor: token('color.background.discovery'),
      border: `1px solid ${token('color.border.discovery')}`,
      hoverBackgroundColor: token('color.background.discovery.hovered'),
      activeBackgroundColor: token('color.background.discovery.pressed'),
      iconColor: token('color.icon.discovery'),
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
        ':hover': { backgroundColor: style.hoverBackgroundColor },
        ':active': { backgroundColor: style.activeBackgroundColor },
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
      <h2>Semantic tokens</h2>
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
