import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
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
} from '../src';

const ResponsivePrimaryButton = (props: PrimaryButtonProps) => {
  const overflowStatus = useOverflowStatus();

  return overflowStatus.isVisible ? (
    <PrimaryButton {...props} />
  ) : (
    <ButtonItem>{props.children}</ButtonItem>
  );
};

const ResponsivePrimaryDropdownButton = (props: PrimaryDropdownButtonProps) => {
  const overflowStatus = useOverflowStatus();

  return overflowStatus.isVisible ? (
    <PrimaryDropdownButton {...props} />
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

const sizes = ['100%', '75%', '50%', '25%'];

export default () => {
  const [size, setSize] = useState(0);
  const sizeIndex = size % sizes.length;

  return (
    <>
      <div style={{ width: sizes[sizeIndex], minWidth: 180 }}>
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

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={() => setSize((prev) => prev + 1)}>
          Set width to {sizes[(sizeIndex + 1) % sizes.length]}
        </Button>
      </div>
    </>
  );
};
