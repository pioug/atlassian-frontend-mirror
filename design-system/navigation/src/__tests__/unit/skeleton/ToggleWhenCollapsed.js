import React from 'react';
import { shallow } from 'enzyme';

import {
  ShownWhenCollapsed,
  HiddenWhenCollapsed,
} from '../../../components/js/skeleton/ToggleWhenCollapsed';

const DummyComponent = () => <div />;

test('ShownWhenCollapsed renders its children when collapsed', () => {
  expect(
    shallow(
      <ShownWhenCollapsed isCollapsed>
        <DummyComponent />
      </ShownWhenCollapsed>,
    ).find(DummyComponent),
  ).toHaveLength(1);
});

test('ShownWhenCollapsed renders no children when not collapsed', () => {
  expect(
    shallow(
      <ShownWhenCollapsed isCollapsed={false}>
        <DummyComponent />
      </ShownWhenCollapsed>,
    ).find(DummyComponent),
  ).toHaveLength(0);
});

test('HiddenWhenCollapsed renders no children when collapsed', () => {
  expect(
    shallow(
      <HiddenWhenCollapsed isCollapsed>
        <DummyComponent />
      </HiddenWhenCollapsed>,
    ).find(DummyComponent),
  ).toHaveLength(0);
});

test('HiddenWhenCollapsed renders its children when not collapsed', () => {
  expect(
    shallow(
      <HiddenWhenCollapsed isCollapsed={false}>
        <DummyComponent />
      </HiddenWhenCollapsed>,
    ).find(DummyComponent),
  ).toHaveLength(1);
});
