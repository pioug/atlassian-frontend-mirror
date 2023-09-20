/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

import { setGlobalTheme, token } from '../src';

const variantStyles = {
  red: {
    subtlest: {
      color: token('color.text.accent.red'),
      backgroundColor: token('color.background.accent.red.subtlest'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: token('color.icon.accent.red'),
    },
    subtler: {
      color: token('color.text.accent.red'),
      backgroundColor: token('color.background.accent.red.subtler'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: token('color.icon.accent.red'),
    },
    subtle: {
      color: token('color.text.accent.red.bolder'),
      backgroundColor: token('color.background.accent.red.subtle'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.red.bolder'),
      border: `1px solid ${token('color.border.accent.red')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  orange: {
    subtlest: {
      color: token('color.text.accent.orange'),
      backgroundColor: token('color.background.accent.orange.subtlest'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: token('color.icon.accent.orange'),
    },
    subtler: {
      color: token('color.text.accent.orange'),
      backgroundColor: token('color.background.accent.orange.subtler'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: token('color.icon.accent.orange'),
    },
    subtle: {
      color: token('color.text.accent.orange.bolder'),
      backgroundColor: token('color.background.accent.orange.subtle'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.orange.bolder'),
      border: `1px solid ${token('color.border.accent.orange')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  yellow: {
    subtlest: {
      color: token('color.text.accent.yellow'),
      backgroundColor: token('color.background.accent.yellow.subtlest'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: token('color.icon.accent.yellow'),
    },
    subtler: {
      color: token('color.text.accent.yellow'),
      backgroundColor: token('color.background.accent.yellow.subtler'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: token('color.icon.accent.yellow'),
    },
    subtle: {
      color: token('color.text.accent.yellow.bolder'),
      backgroundColor: token('color.background.accent.yellow.subtle'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.yellow.bolder'),
      border: `1px solid ${token('color.border.accent.yellow')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  lime: {
    subtlest: {
      color: token('color.text.accent.lime'),
      backgroundColor: token('color.background.accent.lime.subtlest'),
      border: `1px solid ${token('color.border.accent.lime')}`,
      iconColor: token('color.icon.accent.lime'),
    },
    subtler: {
      color: token('color.text.accent.lime'),
      backgroundColor: token('color.background.accent.lime.subtler'),
      border: `1px solid ${token('color.border.accent.lime')}`,
      iconColor: token('color.icon.accent.lime'),
    },
    subtle: {
      color: token('color.text.accent.lime.bolder'),
      backgroundColor: token('color.background.accent.lime.subtle'),
      border: `1px solid ${token('color.border.accent.lime')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.lime.bolder'),
      border: `1px solid ${token('color.border.accent.lime')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  green: {
    subtlest: {
      color: token('color.text.accent.green'),
      backgroundColor: token('color.background.accent.green.subtlest'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: token('color.icon.accent.green'),
    },
    subtler: {
      color: token('color.text.accent.green'),
      backgroundColor: token('color.background.accent.green.subtler'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: token('color.icon.accent.green'),
    },
    subtle: {
      color: token('color.text.accent.green.bolder'),
      backgroundColor: token('color.background.accent.green.subtle'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.green.bolder'),
      border: `1px solid ${token('color.border.accent.green')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  teal: {
    subtlest: {
      color: token('color.text.accent.teal'),
      backgroundColor: token('color.background.accent.teal.subtlest'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: token('color.icon.accent.teal'),
    },
    subtler: {
      color: token('color.text.accent.teal'),
      backgroundColor: token('color.background.accent.teal.subtler'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: token('color.icon.accent.teal'),
    },
    subtle: {
      color: token('color.text.accent.teal.bolder'),
      backgroundColor: token('color.background.accent.teal.subtle'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.teal.bolder'),
      border: `1px solid ${token('color.border.accent.teal')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  blue: {
    subtlest: {
      color: token('color.text.accent.blue'),
      backgroundColor: token('color.background.accent.blue.subtlest'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: token('color.icon.accent.blue'),
    },
    subtler: {
      color: token('color.text.accent.blue'),
      backgroundColor: token('color.background.accent.blue.subtler'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: token('color.icon.accent.blue'),
    },
    subtle: {
      color: token('color.text.accent.blue.bolder'),
      backgroundColor: token('color.background.accent.blue.subtle'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.blue.bolder'),
      border: `1px solid ${token('color.border.accent.blue')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  purple: {
    subtlest: {
      color: token('color.text.accent.purple'),
      backgroundColor: token('color.background.accent.purple.subtlest'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: token('color.icon.accent.purple'),
    },
    subtler: {
      color: token('color.text.accent.purple'),
      backgroundColor: token('color.background.accent.purple.subtler'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: token('color.icon.accent.purple'),
    },
    subtle: {
      color: token('color.text.accent.purple.bolder'),
      backgroundColor: token('color.background.accent.purple.subtle'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.purple.bolder'),
      border: `1px solid ${token('color.border.accent.purple')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  magenta: {
    subtlest: {
      color: token('color.text.accent.magenta'),
      backgroundColor: token('color.background.accent.magenta.subtlest'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: token('color.icon.accent.magenta'),
    },
    subtler: {
      color: token('color.text.accent.magenta'),
      backgroundColor: token('color.background.accent.magenta.subtler'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: token('color.icon.accent.magenta'),
    },
    subtle: {
      color: token('color.text.accent.magenta.bolder'),
      backgroundColor: token('color.background.accent.magenta.subtle'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.magenta.bolder'),
      border: `1px solid ${token('color.border.accent.magenta')}`,
      iconColor: token('color.icon.inverse'),
    },
  },
  gray: {
    subtlest: {
      color: token('color.text.accent.gray'),
      backgroundColor: token('color.background.accent.gray.subtlest'),
      border: `1px solid ${token('color.border.accent.gray')}`,
      iconColor: token('color.icon.accent.gray'),
    },
    subtler: {
      color: token('color.text.accent.gray'),
      backgroundColor: token('color.background.accent.gray.subtler'),
      border: `1px solid ${token('color.border.accent.gray')}`,
      iconColor: token('color.icon.accent.gray'),
    },
    subtle: {
      color: token('color.text.accent.gray.bolder'),
      backgroundColor: token('color.background.accent.gray.subtle'),
      border: `1px solid ${token('color.border.accent.gray')}`,
      iconColor: 'transparent',
    },
    bolder: {
      color: token('color.text.inverse'),
      backgroundColor: token('color.background.accent.gray.bolder'),
      border: `1px solid ${token('color.border.accent.gray')}`,
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
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '200px',
  minHeight: '100px',
  padding: '1em',
  alignItems: 'center',
  borderRadius: token('border.radius.100'),
  marginBlockStart: '1em',
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
        backgroundColor: style.backgroundColor,
        border: style.border,
        color: style.color,
      }),
    ]}
  >
    <AtlassianIcon label="Atlassian logo" primaryColor={style.iconColor} />
    {text}
  </button>
);

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
