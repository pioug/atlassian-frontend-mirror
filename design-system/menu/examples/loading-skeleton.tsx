import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import Icon from '@atlaskit/icon';
import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { B300, N40, N800, Y300 } from '@atlaskit/theme/colors';

import {
  ButtonItem,
  ButtonItemProps,
  HeadingItem,
  MenuGroup,
  Section,
  SkeletonHeadingItem,
  SkeletonItem,
} from '../src';

import Invision from './icons/invision';
import Portfolio from './icons/portfolio';
import Slack from './icons/slack';
import Tempo from './icons/tempo';

const Item = ({
  isLoading,
  ...props
}: ButtonItemProps & { isLoading?: boolean }) => {
  if (isLoading) {
    return <SkeletonItem hasIcon isShimmering />;
  }

  return <ButtonItem {...props} />;
};

const Heading = ({ isLoading, ...props }: any) => {
  if (isLoading) {
    return <SkeletonHeadingItem isShimmering />;
  }

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
    <div>
      <div
        style={{
          color: N800,
          border: `1px solid ${N40}`,
          boxShadow:
            '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
          borderRadius: 4,
          maxWidth: 320,
          margin: '16px auto',
        }}
      >
        <MenuGroup>
          <Section aria-labelledby={isLoading ? '' : 'apps'}>
            <Heading aria-hidden id="apps" isLoading={isLoading}>
              Apps
            </Heading>
            <Item
              isLoading={isLoading}
              iconBefore={
                <div
                  style={{
                    height: 24,
                    width: 24,
                    background:
                      'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',
                    borderRadius: 3,
                  }}
                >
                  <Icon glyph={Portfolio} primaryColor={B300} label="" />
                </div>
              }
              iconAfter={<StarFilledIcon primaryColor={Y300} label="" />}
            >
              Portfolio
            </Item>
            <Item
              isLoading={isLoading}
              iconBefore={<Icon glyph={Tempo} label="" />}
              iconAfter={<StarFilledIcon primaryColor={Y300} label="" />}
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
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button testId="toggle-loading" onClick={() => setRetryLoading(true)}>
          Reload
        </Button>
      </div>
    </div>
  );
};
