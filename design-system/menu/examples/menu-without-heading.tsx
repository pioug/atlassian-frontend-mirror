import React from 'react';

import Icon from '@atlaskit/icon';
import StarIcon from '@atlaskit/icon/glyph/star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { token } from '@atlaskit/tokens';

import { ButtonItem, MenuGroup, Section } from '../src';

import Invision from './icons/invision';
import Portfolio from './icons/portfolio';
import Slack from './icons/slack';
import Tempo from './icons/tempo';

export default () => {
  return (
    <div
      style={{
        color: token('color.text'),
        backgroundColor: token('elevation.surface.overlay', '#fff'),
        boxShadow: token(
          'elevation.shadow.overlay',
          '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
        ),
        borderRadius: 4,
        maxWidth: 320,
        margin: `${token('space.200', '16px')} auto`,
      }}
    >
      <MenuGroup>
        <Section>
          <ButtonItem
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
                <Icon
                  glyph={Portfolio}
                  primaryColor={token('color.icon.brand')}
                  label=""
                />
              </div>
            }
            iconAfter={
              <StarFilledIcon
                primaryColor={token('color.icon.warning')}
                label=""
              />
            }
          >
            Portfolio
          </ButtonItem>
          <ButtonItem
            iconBefore={<Icon glyph={Tempo} label="" />}
            iconAfter={
              <StarFilledIcon
                primaryColor={token('color.icon.warning')}
                label=""
              />
            }
          >
            Tempo timesheets
          </ButtonItem>
          <ButtonItem
            iconBefore={<Icon glyph={Invision} label="" />}
            iconAfter={<StarIcon label="" />}
          >
            Invision
          </ButtonItem>
          <ButtonItem iconBefore={<Icon glyph={Slack} label="" />}>
            Slack
          </ButtonItem>
        </Section>
        <Section hasSeparator>
          <ButtonItem>Find new apps</ButtonItem>
          <ButtonItem>Manage your apps</ButtonItem>
        </Section>
      </MenuGroup>
    </div>
  );
};
