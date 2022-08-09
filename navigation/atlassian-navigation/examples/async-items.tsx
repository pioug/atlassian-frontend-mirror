import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { ButtonItem } from '@atlaskit/menu';

import {
  AtlassianNavigation,
  Create,
  PrimaryButton,
  PrimaryButtonProps,
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

export default () => {
  const [items, setItems] = useState<JSX.Element[]>([]);

  const insertItems = () =>
    setItems([
      <ResponsivePrimaryButton>Explore</ResponsivePrimaryButton>,
      <ResponsivePrimaryButton>Projects</ResponsivePrimaryButton>,
      <ResponsivePrimaryButton>Dashboards</ResponsivePrimaryButton>,
      <ResponsivePrimaryButton>Apps</ResponsivePrimaryButton>,
      <ResponsivePrimaryButton>Plans</ResponsivePrimaryButton>,
    ]);

  const insertSingleItem = () =>
    setItems([
      ...items,
      <ResponsivePrimaryButton>Foo</ResponsivePrimaryButton>,
    ]);
  const clearItems = () => setItems([]);

  return (
    <>
      <AtlassianNavigation
        label="site"
        renderProductHome={() => null}
        renderCreate={() => <Create onClick={console.log} text="Create" />}
        primaryItems={items}
        moreLabel="More"
      />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={insertItems}>Insert 5</Button>
        <Button onClick={insertSingleItem}>Insert 1</Button>
        <Button onClick={clearItems}>Clear</Button>
      </div>
    </>
  );
};
