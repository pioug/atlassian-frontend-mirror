import React from 'react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ButtonItem, MenuGroup, Section } from '../src';

import battery from './icons/battery.png';
import cloud from './icons/cloud.png';
import koala from './icons/koala.png';
import ui from './icons/ui.png';
import wallet from './icons/wallet.png';

const ImgIcon = ({ src, alt }: { src: string; alt?: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

export default () => {
  return (
    <div
      style={{
        color: token('color.text.highEmphasis', N800),
        backgroundColor: token('color.background.overlay', '#fff'),
        boxShadow: token(
          'shadow.overlay',
          '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
        ),
        borderRadius: 4,
        maxWidth: 320,
        margin: '16px auto',
      }}
    >
      <MenuGroup maxHeight={300}>
        <Section title="Recent" isScrollable>
          <ButtonItem
            iconBefore={<ImgIcon src={battery} alt="Battery" />}
            description="Next-gen software project"
          >
            Fabric Editor
          </ButtonItem>
          <ButtonItem
            iconBefore={<ImgIcon src={cloud} alt="Cloud" />}
            description="Classic business project"
          >
            Content Services
          </ButtonItem>
          <ButtonItem
            iconBefore={<ImgIcon src={wallet} alt="Wallet" />}
            description="Next-gen software project"
          >
            Trinity Mobile
          </ButtonItem>
          <ButtonItem
            iconBefore={<ImgIcon src={koala} alt="Koala" />}
            description="Classic service desk"
          >
            Customer Feedback
          </ButtonItem>
          <ButtonItem
            iconBefore={<ImgIcon src={ui} alt="UI logo" />}
            description="Classic software project"
          >
            Design System
          </ButtonItem>
        </Section>
        <Section hasSeparator>
          <ButtonItem>View all projects</ButtonItem>
          <ButtonItem>Create project</ButtonItem>
        </Section>
      </MenuGroup>
    </div>
  );
};
