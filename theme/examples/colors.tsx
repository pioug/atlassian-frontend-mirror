/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import color from 'color';
import { colors, borderRadius, ThemedValue } from '../src';

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
    css={css`
      display: inline-block;
      background-color: ${primary};
      border-radius: ${borderRadius()}px;
      color: ${secondary};
      margin-bottom: 4px;
      margin-right: 4px;
      padding: 8px;
      width: calc(33% - 20px);
      font-weight: 600;
      font-size: 12px;
    `}
  >
    {name}
  </span>
);

const separateWords = (str: string) => {
  return str.replace(/([A-z][A-Z])/g, e => {
    return e.split('').join(' ');
  });
};

export const Heading = ({
  children,
  index,
}: {
  children: any;
  index?: number;
}) => (
  <h6
    css={css`
      margin-top: ${index === 0 ? 0 : 16}px !important;
      margin-bottom: 4px;
    `}
  >
    {children}
  </h6>
);

export default () =>
  Object.entries(colorGroups).map(([groupName, groupColors], index) => (
    <div key={groupName}>
      <Heading>{separateWords(groupName)}</Heading>

      <div>
        {groupColors.map(colorData => {
          const actualColor =
            typeof colorData.value === 'string'
              ? colorData.value
              : colorData.value();

          return (
            <ColorPill
              key={colorData.name}
              name={colorData.name}
              primary={actualColor}
              secondary={
                color(actualColor).isLight() ? colors.N800 : colors.N10
              }
            />
          );
        })}
      </div>
    </div>
  ));
