import React from 'react';

import { HashRouter, Link } from 'react-router-dom';

import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import StarIcon from '@atlaskit/icon/glyph/star';

import {
  ButtonItem,
  CustomItem,
  CustomItemComponentProps,
  HeadingItem,
  LinkItem,
  Section,
  SkeletonHeadingItem,
  SkeletonItem,
} from '../src';

const Emphasis = (props: CustomItemComponentProps) => <em {...props} />;
const Star = <StarIcon label="" />;

const ItemVariants = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <HeadingItem testId="heading-item">This is a heading Item</HeadingItem>
      <ButtonItem testId="item-button">Regular Item</ButtonItem>
      <ButtonItem
        testId="item-button-at-scale"
        description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
      >
        The long title (properly, the title in some jurisdictions) is the formal
        title appearing at the head of a statute (such as an act of Parliament
        or of Congress) or other legislative instrument.
      </ButtonItem>
      <ButtonItem
        iconBefore={<StarIcon label="Icon before" />}
        iconAfter={<StarIcon label="Icon after" />}
        testId="item-button-at-scale-before-after"
        description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
      >
        The long title (properly, the title in some jurisdictions) is the formal
        title appearing at the head of a statute (such as an act of Parliament
        or of Congress) or other legislative instrument.
      </ButtonItem>
      <ButtonItem
        testId="item-button-at-scale-multiple-line-title"
        shouldTitleWrap
        description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
      >
        The long title (properly, the title in some jurisdictions) is the formal
        title appearing at the head of a statute (such as an act of Parliament
        or of Congress) or other legislative instrument.
      </ButtonItem>
      <ButtonItem
        testId="item-button-at-scale-multiple-line-title-and-description"
        shouldTitleWrap
        shouldDescriptionWrap
        description="The long title is intended to provide a summarised description of the purpose or scope of the instrument."
      >
        The long title (properly, the title in some jurisdictions) is the formal
        title appearing at the head of a statute (such as an act of Parliament
        or of Congress) or other legislative instrument.
      </ButtonItem>
      <ButtonItem
        testId="item-button-before"
        iconBefore={<EmojiCustomIcon label="Icon before" />}
      >
        With iconBefore prop
      </ButtonItem>
      <ButtonItem
        testId="item-button-after"
        iconAfter={<StarIcon label="Icon before" />}
      >
        With iconAfter prop
      </ButtonItem>
      <ButtonItem
        testId="item-button-before-after"
        iconBefore={<EmojiCustomIcon label="icon before" />}
        iconAfter={<StarIcon label="icon after" />}
      >
        With both iconAfter and iconBefore prop
      </ButtonItem>
      <ButtonItem testId="item-button-disabled" isDisabled>
        Disabled Item
      </ButtonItem>
      <ButtonItem testId="item-button-selected" isSelected>
        Selected Item
      </ButtonItem>
      <ButtonItem
        testId="item-button-description"
        description="Some textual description"
      >
        Item with description
      </ButtonItem>
      <LinkItem testId="item-link" href="//www.atlassian.com">
        Link item that takes you to atlassian home page
      </LinkItem>
      <LinkItem
        testId="item-link-selected"
        href="//www.atlassian.com"
        iconAfter={Star}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        cssFn={() => {
          return {
            padding: '12px 20px',
            [`& [data-item-elem-after]`]: { opacity: 0 },
            [`&:hover [data-item-elem-after]`]: { opacity: 1 },
          };
        }}
        isSelected
      >
        Selected Link Item
      </LinkItem>
      <LinkItem
        shouldTitleWrap
        testId="item-link-multiple-line"
        href="//www.atlassian.com"
      >
        Link item that takes you to atlassian home page, but with some extra
        text to make the content a bit longer than usual.
      </LinkItem>
      <LinkItem
        shouldTitleWrap
        testId="item-link-long-url-multiple-line"
        href="//www.atlassian.com"
      >
        https://atlassian.design/components/dropdown-menu/dropdown-menu-stateless/examples
      </LinkItem>
      <CustomItem testId="item-custom-em" component={Emphasis}>
        Custom element using em tag
      </CustomItem>
      <CustomItem
        testId="item-custom-em-disabled"
        isDisabled
        component={Emphasis}
      >
        Disabled custom element using em tag
      </CustomItem>
      <CustomItem
        shouldTitleWrap
        testId="item-custom-em-multiple-line"
        component={Emphasis}
      >
        Custom element using em tag, but with some extra text to make the
        content a bit longer than usual.
      </CustomItem>
      <HashRouter>
        <CustomItem
          component={Link}
          to="/my-route"
          testId="item-custom-router"
          description="some custom text"
          isSelected
          iconAfter={<StarIcon label="icon after" />}
          iconBefore={<EmojiCustomIcon label="icon before" />}
        >
          I'm a react-router link rendered using CustomItem
        </CustomItem>
      </HashRouter>

      <Section>
        <SkeletonHeadingItem testId="skeleton-heading-item" />
        <SkeletonItem testId="skeleton-item" />
        <SkeletonItem testId="skeleton-item-avatar" hasAvatar />
        <SkeletonItem testId="skeleton-item-icon" hasIcon />
        <SkeletonItem testId="skeleton-item-width" hasIcon width="100%" />
      </Section>
    </div>
  );
};

export default ItemVariants;
