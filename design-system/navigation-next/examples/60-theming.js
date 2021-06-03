import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BoardIcon from '@atlaskit/icon/glyph/board';

import {
  dark,
  GroupHeading,
  Item,
  light,
  modeGenerator,
  Separator,
  settings,
  SkeletonContainerHeader,
  SkeletonItem,
  ThemeProvider,
} from '../src';
import { CONTENT_NAV_WIDTH } from '../src/common/constants';

/**
 * Helper components
 */

const ThemedComponents = ({ themeContext, themeMode }) => (
  <ThemeProvider
    theme={(theme) => ({
      ...theme,
      context: themeContext,
      mode: themeMode,
    })}
  >
    <div
      css={{
        padding: '1px 20px 20px',
        backgroundColor: themeMode.contentNav()[themeContext].backgroundColor,
      }}
    >
      <GroupHeading>Skeletons & items</GroupHeading>
      <SkeletonContainerHeader />
      <SkeletonItem />
      <Item text="Item one" subText="Sub text" after={ArrowRightIcon} />
      <Item text="Item two selected" subText="Sub text" isSelected />
      <Separator />
      <GroupHeading>States</GroupHeading>
      <Item before={BoardIcon} text="With icon, selected" isSelected />
      <Item before={BoardIcon} text="With icon, hover" isHover />
      <Item before={BoardIcon} text="With icon, active" isActive />
    </div>
  </ThemeProvider>
);

const variations = [
  {
    itemComponent: ThemedComponents,
    title: 'Container light ',
    themeContext: 'container',
    themeMode: light,
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product "light" ',
    themeContext: 'product',
    themeMode: light,
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product "dark"',
    themeContext: 'product',
    themeMode: dark,
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product "settings"',
    themeContext: 'product',
    themeMode: settings,
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product bright and saturated',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#FFFEFE', background: '#BD2B25' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product bright and saturated 2',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#FEFEEE', background: '#469EEF' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product bright and saturated 3',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#000000', background: '#F6C544' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product bright and dull',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#222299', background: '#F9F9FB' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product pastel',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#112222', background: '#9edcc6' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product dull',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#FFFFFF', background: '#7E7F7E' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product regular',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#FFFFFF', background: '#5548b1' },
    }),
  },
  {
    itemComponent: ThemedComponents,
    title: 'Product white',
    themeContext: 'product',
    themeMode: modeGenerator({
      product: { text: '#EE1111', background: '#FFFFFF' },
    }),
  },
];

const Container = (props) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}
    {...props}
  />
);
const VariationWrapper = (props) => (
  <div css={{ margin: '0 24px 24px 0' }} {...props} />
);
const ItemWrapper = (props) => (
  <div css={{ margin: '4px 0', width: `${CONTENT_NAV_WIDTH}px` }} {...props} />
);

export default () => (
  <Container>
    {variations.map(
      ({ title, itemComponent: ItemComponent = Item, ...props }) => (
        <VariationWrapper key={title}>
          <h3>{title}</h3>
          <ItemWrapper>
            <ItemComponent {...props} />
          </ItemWrapper>
        </VariationWrapper>
      ),
    )}
  </Container>
);
