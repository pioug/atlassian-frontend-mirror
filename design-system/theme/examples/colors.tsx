/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';
import color from 'color';

import { borderRadius, colors, ThemedValue } from '../src';

const emptyColor = (): {
  name: string;
  value: string | ThemedValue<string>;
}[] => [];

const colorGroups = Object.entries(colors).reduce(
  (acc, [name, value]) => {
    const data = { name, value };
    let group = acc.named;

    if (name.startsWith('R')) {
      group = acc.reds;
    } else if (name.startsWith('Y')) {
      group = acc.yellows;
    } else if (name.startsWith('G')) {
      group = acc.greens;
    } else if (name.startsWith('B')) {
      group = acc.blues;
    } else if (name.startsWith('P')) {
      group = acc.purples;
    } else if (name.startsWith('T')) {
      group = acc.teals;
    } else if (name.startsWith('N')) {
      group = acc.neutrals;
    } else if (name.startsWith('DN')) {
      group = acc.darkModeNeutrals;
    }

    group.push(data);

    return acc;
  },
  {
    reds: emptyColor(),
    yellows: emptyColor(),
    greens: emptyColor(),
    blues: emptyColor(),
    purples: emptyColor(),
    teals: emptyColor(),
    neutrals: emptyColor(),
    darkModeNeutrals: emptyColor(),
    named: emptyColor(),
  },
);

const colorPillStyles = css({
  display: 'inline-block',
  width: 'calc(33% - 20px)',
  marginRight: '4px',
  marginBottom: '4px',
  padding: '8px',
  borderRadius: `${borderRadius()}px`,
  fontSize: '12px',
  fontWeight: 600,
});

export const ColorPill = ({
  primary,
  secondary,
  name,
}: {
  primary: string;
  secondary: string;
  name: string;
}) => (
  <span
    style={{
      color: secondary,
      backgroundColor: primary,
    }}
    data-testid="color-pill"
    css={colorPillStyles}
  >
    {name}
  </span>
);

const separateWords = (str: string) => {
  return str.replace(/([A-z][A-Z])/g, (e) => {
    return e.split('').join(' ');
  });
};

const headingStyles = css({
  marginTop: '16px',
  marginBottom: '4px',
});

const firstHeadingStyles = css({
  marginTop: 0,
});

export const Heading: FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <h6 className={className} css={headingStyles}>
    {children}
  </h6>
);

export default () => (
  <div id="colors">
    {Object.entries(colorGroups).map(([groupName, groupColors], index) => (
      <div key={groupName}>
        <Heading css={index === 0 && firstHeadingStyles}>
          {separateWords(groupName)}
        </Heading>
        <div data-testid="color-palette">
          {groupColors.map((colorData) => {
            const actualColor =
              typeof colorData.value === 'string'
                ? colorData.value
                : colorData.value();

            const secondaryColor = color(actualColor).isLight()
              ? colors.N800
              : colors.N10;

            return (
              <ColorPill
                key={colorData.name}
                name={colorData.name}
                primary={actualColor}
                secondary={secondaryColor}
              />
            );
          })}
        </div>
      </div>
    ))}
  </div>
);
