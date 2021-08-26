import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle';
import { N30, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  ButtonItem,
  HeadingItem,
  MenuGroup,
  Section,
  SkeletonHeadingItem,
  SkeletonItem,
} from '../src';

const Item = ({ isLoading, ...props }: any) => {
  if (isLoading) {
    return <SkeletonItem {...props} />;
  }

  let icon;
  let content;

  if (props.hasIcon) {
    icon = <EmojiCustomIcon label="" />;
    content = 'Create';
  } else if (props.hasAvatar) {
    icon = (
      <span
        style={{
          background: token('color.text.onBold', N30),
          borderRadius: '50%',
          width: 24,
          height: 24,
        }}
      >
        <UserAvatarCircleIcon
          primaryColor={token('color.text.lowEmphasis', N40)}
          label=""
        />
      </span>
    );
    content = 'John Smith';
  } else {
    content = 'Action name';
  }

  return <ButtonItem iconBefore={icon}>{content}</ButtonItem>;
};

const Heading = ({ isLoading }: any) => {
  if (isLoading) {
    return <SkeletonHeadingItem />;
  }

  return <HeadingItem>Heading</HeadingItem>;
};

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <ButtonGroup>
        <Button
          testId="toggle-loading"
          onClick={() => setIsLoading((prev) => !prev)}
        >
          Set {isLoading ? 'Loaded' : 'Loading'}
        </Button>
      </ButtonGroup>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '200px',
            border: `1px solid ${token('color.border.neutral', '#EFEFEF')}`,
            margin: '10px auto',
            borderRadius: '4px',
            alignSelf: 'flex-start',
          }}
        >
          <MenuGroup maxHeight={300} testId="left-menu">
            <Section>
              <Heading isLoading={isLoading} />
              {Array(3)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasAvatar />
                ))}
            </Section>
            <Section hasSeparator>
              <Heading isLoading={isLoading} />
              {Array(1)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasIcon />
                ))}
            </Section>
          </MenuGroup>
        </div>
        <div
          style={{
            width: '200px',
            border: `1px solid ${token('color.border.neutral', '#EFEFEF')}`,
            margin: '10px auto',
            borderRadius: '4px',
          }}
        >
          <MenuGroup maxHeight={300} testId="right-menu">
            <Section>
              <Heading isLoading={isLoading} />
            </Section>
            <Section isScrollable hasSeparator>
              {Array(5)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasIcon />
                ))}
            </Section>
            <Section hasSeparator>
              {Array(2)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} />
                ))}
            </Section>
          </MenuGroup>
        </div>
      </div>
    </div>
  );
};
