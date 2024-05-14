import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import Icon from '@atlaskit/icon';
import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
  ButtonItem,
  ButtonItemProps,
  HeadingItem,
  MenuGroup,
  Section,
  SkeletonHeadingItem,
  SkeletonItem,
} from '../../src';
import MenuGroupContainer from '../common/menu-group-container';
import Invision from '../icons/invision';
import Portfolio from '../icons/portfolio';
import Slack from '../icons/slack';
import Tempo from '../icons/tempo';

const iconContainerStyles = xcss({
  height: 'size.200',
  width: 'size.200',
  background: 'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',
  borderRadius: 'border.radius',
});

const buttonContainerStyles = xcss({
  display: 'flex',
  justifyContent: 'center',
});

const Item = ({
  isLoading,
  ...props
}: ButtonItemProps & { isLoading?: boolean }) => {
  if (isLoading) {
    return <SkeletonItem hasIcon isShimmering />;
  }

  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <ButtonItem {...props} />;
};

const Heading = ({ isLoading, ...props }: any) => {
  if (isLoading) {
    return <SkeletonHeadingItem isShimmering />;
  }

  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <HeadingItem {...props} />;
};

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(true);

  useEffect(() => {
    if (!retryLoading) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setRetryLoading(false);
      setIsLoading(false);
    }, 1500);
  }, [retryLoading]);

  return (
    <Stack space="space.200">
      <MenuGroupContainer>
        <MenuGroup>
          <Section aria-labelledby={isLoading ? '' : 'apps'}>
            <Heading aria-hidden id="apps" isLoading={isLoading}>
              Apps
            </Heading>
            <Item
              isLoading={isLoading}
              iconBefore={
                <Box xcss={iconContainerStyles}>
                  <Icon
                    glyph={Portfolio}
                    primaryColor={token('color.icon.brand')}
                    label=""
                  />
                </Box>
              }
              iconAfter={
                <StarFilledIcon
                  primaryColor={token('color.icon.warning')}
                  label=""
                />
              }
            >
              Portfolio
            </Item>
            <Item
              isLoading={isLoading}
              iconBefore={<Icon glyph={Tempo} label="" />}
              iconAfter={
                <StarFilledIcon
                  primaryColor={token('color.icon.warning')}
                  label=""
                />
              }
            >
              Tempo timesheets
            </Item>
            <Item
              isLoading={isLoading}
              iconBefore={<Icon glyph={Invision} label="" />}
              iconAfter={<StarIcon label="" />}
            >
              Invision
            </Item>
            <Item
              isLoading={isLoading}
              iconBefore={<Icon glyph={Slack} label="" />}
            >
              Slack
            </Item>
          </Section>
          <Section hasSeparator>
            <Item>Find new apps</Item>
            <Item>Manage your apps</Item>
          </Section>
        </MenuGroup>
      </MenuGroupContainer>
      <Box xcss={buttonContainerStyles}>
        <Button testId="toggle-loading" onClick={() => setRetryLoading(true)}>
          Reload
        </Button>
      </Box>
    </Stack>
  );
};
