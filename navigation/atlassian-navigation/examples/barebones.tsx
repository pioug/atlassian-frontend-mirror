import React, { useState } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { ButtonItem, PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius, colors } from '@atlaskit/theme';

import {
  AtlassianNavigation,
  PrimaryButton,
  PrimaryDropdownButton,
  ProductHome,
} from '../src';

import appsSplash from './shared/assets/Apps4x.png';

const ProductHomeExample = () => (
  <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />
);

const PopupContents = () => (
  <PopupMenuGroup>
    <Section>
      <ButtonItem
        description="But what is an Atlassian, anyway?"
        iconBefore={
          <QuestionCircleIcon
            primaryColor={colors.B300}
            label=""
            size="medium"
          />
        }
      >
        About
      </ButtonItem>
    </Section>
  </PopupMenuGroup>
);

const ExploreDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      content={PopupContents}
      isOpen={isOpen}
      placement="bottom-start"
      onClose={() => setIsOpen(false)}
      trigger={(triggerProps) => (
        <PrimaryDropdownButton
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Explore
        </PrimaryDropdownButton>
      )}
    />
  );
};

export default () => (
  <div
    style={{
      paddingBottom: 8,
      border: `1px solid ${colors.N40}`,
      borderRadius: borderRadius(),
    }}
  >
    <AtlassianNavigation
      label="site"
      primaryItems={[
        <PrimaryButton>Issues</PrimaryButton>,
        <ExploreDropdown />,
      ]}
      renderProductHome={ProductHomeExample}
    />

    <img
      src={appsSplash}
      style={{
        display: 'block',
        margin: '0 auto',
        maxWidth: '800px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '60px 100px',
      }}
    />
  </div>
);
