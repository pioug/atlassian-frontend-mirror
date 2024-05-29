import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import {
  AtlassianNavigation,
  Create,
  PrimaryButton,
  type PrimaryButtonProps,
  PrimaryDropdownButton,
  type PrimaryDropdownButtonProps,
  useOverflowStatus,
} from '../src';

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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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

      <div
        style={{
          // TODO Delete this comment after verifying space token -> previous value `'20px'`
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          marginTop: token('space.250', '20px'),
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          textAlign: 'center',
        }}
      >
        <Button onClick={() => setSize((prev) => prev + 1)}>
          Set width to {sizes[(sizeIndex + 1) % sizes.length]}
        </Button>
      </div>
    </>
  );
};
