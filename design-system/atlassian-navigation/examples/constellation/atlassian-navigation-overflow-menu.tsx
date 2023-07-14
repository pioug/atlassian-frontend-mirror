import React from 'react';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { ButtonItem } from '@atlaskit/menu';

import {
  AtlassianNavigation,
  Create,
  PrimaryButton,
  PrimaryButtonProps,
  PrimaryDropdownButton,
  PrimaryDropdownButtonProps,
  useOverflowStatus,
} from '../../src';

const ResponsivePrimaryButton = (props: PrimaryButtonProps) => {
  const overflowStatus = useOverflowStatus();

  return overflowStatus.isVisible ? (
    <PrimaryButton>{props.children}</PrimaryButton>
  ) : (
    <ButtonItem>{props.children}</ButtonItem>
  );
};

const ResponsivePrimaryDropdownButton = (props: PrimaryDropdownButtonProps) => {
  const overflowStatus = useOverflowStatus();

  return overflowStatus.isVisible ? (
    <PrimaryDropdownButton>{props.children}</PrimaryDropdownButton>
  ) : (
    <ButtonItem
      iconAfter={
        <span style={{ opacity: 0.51 }}>
          <ChevronIcon label="" />
        </span>
      }
    >
      {props.children}
    </ButtonItem>
  );
};

const OverflowMenuExample = () => {
  return (
    <div style={{ width: '50%', minWidth: 180 }}>
      <AtlassianNavigation
        label="site"
        renderProductHome={() => null}
        renderCreate={() => <Create onClick={console.log} text="Create" />}
        primaryItems={[
          <ResponsivePrimaryButton>Explore</ResponsivePrimaryButton>,
          <ResponsivePrimaryButton>Projects</ResponsivePrimaryButton>,
          <ResponsivePrimaryButton>Dashboards</ResponsivePrimaryButton>,
          <ResponsivePrimaryDropdownButton>
            Favourites
          </ResponsivePrimaryDropdownButton>,
        ]}
      />
    </div>
  );
};

export default OverflowMenuExample;
