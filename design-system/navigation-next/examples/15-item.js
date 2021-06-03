import React, { Component } from 'react';

import Badge from '@atlaskit/badge';
import {
  DropdownItem,
  DropdownItemGroup,
  DropdownMenuStateless,
} from '@atlaskit/dropdown-menu';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditIcon from '@atlaskit/icon/glyph/edit';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';

import {
  dark,
  Item,
  ItemAvatar,
  ItemPrimitive,
  light,
  settings,
  SkeletonContainerHeader,
  SkeletonItem,
  ThemeProvider,
} from '../src';
import { CONTENT_NAV_WIDTH } from '../src/common/constants';

const themeModes = { light, dark, settings };

class BetterDropdown extends Component {
  static defaultProps = { defaultIsOpen: false };

  state = { isOpen: this.props.defaultIsOpen };

  onOpenChange = (openState) => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange(openState);
    }
    this.setState({ isOpen: openState.isOpen });
  };

  renderTrigger = () => {
    const { trigger: Trigger } = this.props;
    const { isOpen } = this.state;
    return <Trigger isOpen={isOpen} />;
  };

  render() {
    const { isOpen } = this.state;
    const { trigger, ...props } = this.props;
    return (
      <DropdownMenuStateless
        shouldFitContainer
        {...props}
        isOpen={isOpen}
        onOpenChange={this.onOpenChange}
        trigger={this.renderTrigger()}
      />
    );
  }
}
const ConfiguredAvatar = (itemState) => (
  <ItemAvatar itemState={itemState} presence="online" size="small" />
);

const ConfiguredBadge = () => <Badge appearance="primary">3</Badge>;

const CloseButton = () => (
  <div css={{ lineHeight: 0 }}>
    <Tooltip content="Close conversation" position="right">
      <CrossIcon size="small" />
    </Tooltip>
  </div>
);

const BadgeOrCloseOnHover = ({ isHover }) =>
  isHover ? <CloseButton /> : <ConfiguredBadge />;
const OnFocusLozenge = ({ isFocused }) =>
  isFocused ? (
    <Lozenge appearance="success">focus on</Lozenge>
  ) : (
    <Lozenge appearance="default">focus off</Lozenge>
  );

const variations = [
  {
    title: 'Content variations',
    items: [
      { text: 'Just text' },
      { text: 'Text', subText: 'And sub-text' },
      {
        text: 'Very long text which should truncate',
        subText: 'And very long sub-text which should also truncate',
      },
      {
        before: BoardIcon,
        text: 'Icon before',
      },
      {
        before: ConfiguredAvatar,
        text: 'Avatar before',
      },
      {
        after: () => <Lozenge appearance="success">New</Lozenge>,
        text: 'Lozenge after',
      },
      {
        after: ConfiguredBadge,
        text: 'Badge after',
      },
      {
        after: CloseButton,
        text: 'Action after',
      },
      {
        after: ConfiguredBadge,
        before: BacklogIcon,
        text: 'Before and after',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        text: 'Very long title which should truncate',
        subText: 'Very long sub-text which should truncate',
      },
    ],
  },
  {
    title: 'Spacing variations',
    items: [
      {
        after: EditIcon,
        before: ConfiguredAvatar,
        text: 'Default',
        subText: 'Description',
      },
      {
        after: EditIcon,
        before: ConfiguredAvatar,
        spacing: 'compact',
        text: 'Compact',
        subText: 'My sub-text is smaller',
      },
    ],
  },
  {
    itemComponent: ItemPrimitive,
    title: 'State variations',
    items: [
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        text: 'Default',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isHover: true,
        text: 'Hover',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isActive: true,
        isHover: true,
        text: 'Hover + active',
        subText: 'Sub text',
      },
      {
        after: EditIcon,
        before: BoardIcon,
        isSelected: true,
        text: 'Selected',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isSelected: true,
        text: 'Selected 2',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isHover: true,
        isSelected: true,
        text: 'Selected + hover',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isActive: true,
        isHover: true,
        isSelected: true,
        text: 'Selected + hover + active',
        subText: 'Sub text',
      },
    ],
  },
  {
    itemComponent: ({ themeContext: context, themeMode: mode, ...props }) => (
      <ThemeProvider
        theme={(theme) => ({
          ...theme,
          context,
          mode: themeModes[mode],
        })}
      >
        <Item {...props} />
      </ThemeProvider>
    ),
    title: 'Theme variations',
    items: [
      {
        before: ConfiguredAvatar,
        text: 'Light mode, container context',
        subText: 'Sub text',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Light mode, product context',
        subText: 'Sub text',
        themeMode: 'light',
        themeContext: 'product',
      },
      {
        before: ConfiguredAvatar,
        text: 'Dark mode, container context',
        subText: 'Sub text',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Dark mode, product context',
        subText: 'Sub text',
        themeMode: 'dark',
        themeContext: 'product',
      },
      {
        before: ConfiguredAvatar,
        text: 'Settings mode, container context',
        subText: 'Sub text',
        themeMode: 'settings',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Settings mode, product context',
        subText: 'Sub text',
        themeMode: 'settings',
        themeContext: 'product',
      },
    ],
  },
  {
    title: 'Component variations',
    items: [
      {
        href: '#',
        subText: '<a>',
        target: '_blank',
        text: 'Anchor',
      },
      {
        onClick: () => console.log('You clicked a button'),
        subText: '<button>',
        text: 'Button',
      },
      {
        subText: '<span>',
        text: 'Span',
      },
      {
        component: ({ children, className }) => (
          <div className={className} to="/">
            {children}
          </div>
        ),
        subText: "Pretend I'm a react-router <Link>",
        text: 'Custom component',
      },
    ],
  },
  {
    title: 'Composed Item variations',
    items: [
      {
        render: () => (
          <div css={{ display: 'flex' }}>
            <Item text={<ArrowLeftIcon />} spacing="compact" />
            <div css={{ flexGrow: 1 }}>
              <ItemPrimitive
                text="Split item"
                spacing="compact"
                styles={(styles) => ({
                  ...styles,
                  itemBase: { ...styles.itemBase, cursor: 'default' },
                })}
              />
            </div>
          </div>
        ),
        key: 'split-item',
      },
      {
        render: () => (
          <BetterDropdown
            trigger={({ isOpen }) => (
              <Item
                isSelected={isOpen}
                text="Dropdown item"
                after={() => (isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              />
            )}
          >
            <DropdownItemGroup>
              <DropdownItem>Link 1</DropdownItem>
              <DropdownItem>Link 2</DropdownItem>
              <DropdownItem>Link 3</DropdownItem>
            </DropdownItemGroup>
          </BetterDropdown>
        ),
        key: 'dropdown-item',
      },
    ],
    itemComponent: ({ render: RenderComponent, ...itemProps }) => (
      <RenderComponent {...itemProps} />
    ),
  },
  {
    title: 'Conditional rendering on focus',
    items: [
      {
        after: OnFocusLozenge,
        before: ConfiguredAvatar,
        text: 'Tab me!',
      },
    ],
  },
  {
    itemComponent: ({ themeContext: context, themeMode: mode, ...props }) => (
      <ThemeProvider
        theme={(theme) => ({
          ...theme,
          context,
          mode: themeModes[mode],
        })}
      >
        <SkeletonItem {...props} />
      </ThemeProvider>
    ),
    title: 'Skeleton item',
    items: [
      {
        key: 'light-container-skeleton',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'light-container-skeleton-with-icon',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        key: 'light-product-skeleton',
        themeMode: 'light',
        themeContext: 'product',
      },
      {
        hasBefore: true,
        key: 'light-product-skeleton-with-icon',
        themeMode: 'light',
        themeContext: 'product',
      },
      {
        key: 'dark-container-skeleton',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'dark-container-skeleton-with-icon',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        key: 'settings-container-skeleton',
        themeMode: 'settings',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'settings-container-skeleton-with-icon',
        themeMode: 'settings',
        themeContext: 'container',
      },
    ],
  },
  {
    itemComponent: ({ themeContext: context, themeMode: mode, ...props }) => (
      <ThemeProvider
        theme={(theme) => ({
          ...theme,
          context,
          mode: themeModes[mode],
        })}
      >
        <SkeletonContainerHeader {...props} />
      </ThemeProvider>
    ),
    title: 'Skeleton header',
    items: [
      {
        key: 'light-container-skeleton',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'light-container-skeleton-with-icon',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        key: 'light-product-skeleton',
        themeMode: 'light',
        themeContext: 'product',
      },
      {
        hasBefore: true,
        key: 'light-product-skeleton-with-icon',
        themeMode: 'light',
        themeContext: 'product',
      },
      {
        key: 'dark-container-skeleton',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'dark-container-skeleton-with-icon',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        key: 'settings-container-skeleton',
        themeMode: 'settings',
        themeContext: 'container',
      },
      {
        hasBefore: true,
        key: 'settings-container-skeleton-with-icon',
        themeMode: 'settings',
        themeContext: 'container',
      },
    ],
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
    {variations.map(({ title, items, itemComponent: ItemComponent = Item }) => (
      <VariationWrapper key={title}>
        <h3>{title}</h3>
        {items.map((item) => (
          <ItemWrapper key={item.key || item.text}>
            <ItemComponent {...item} />
          </ItemWrapper>
        ))}
      </VariationWrapper>
    ))}
  </Container>
);
