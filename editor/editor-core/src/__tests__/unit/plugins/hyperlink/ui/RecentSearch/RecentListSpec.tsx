import React from 'react';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import RecentList from '../../../../../../ui/RecentSearch/RecentList';
import RecentItem from '../../../../../../ui/RecentSearch/RecentItem';

const noop = () => {};
describe('@atlaskit/editor-core/ui/RecentSearch/RecentList', () => {
  it('should render the list when loaded', () => {
    const items = [
      {
        objectId: '1',
        name: 'name',
        container: 'container',
        url: 'url',
        iconUrl: 'iconUrl',
      },
    ];

    const component = mount(
      <RecentList
        items={items}
        isLoading={false}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />,
    );

    expect(component.find(RecentItem)).toHaveLength(1);
    component.unmount();
  });

  it('should render a spinner when loading', () => {
    const component = mount(
      <RecentList
        isLoading={true}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />,
    );

    expect(component.find(Spinner)).toHaveLength(1);
    component.unmount();
  });

  it('should not render a spinner when not loading', () => {
    const component = mount(
      <RecentList
        isLoading={false}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />,
    );

    expect(component.find(Spinner)).toHaveLength(0);
    component.unmount();
  });

  it('should select the item on selectedIndex', () => {
    const items = [
      {
        objectId: '1',
        name: 'name',
        container: 'container',
        url: 'url',
        iconUrl: 'iconUrl',
      },
      {
        objectId: '2',
        name: 'name',
        container: 'container',
        url: 'url',
        iconUrl: 'iconUrl',
      },
    ];

    const component = mount(
      <RecentList
        items={items}
        isLoading={false}
        selectedIndex={1}
        onSelect={noop}
        onMouseMove={noop}
      />,
    );

    expect(component.find(RecentItem)).toHaveLength(2);
    expect(
      component
        .find(RecentItem)
        .at(0)
        .props(),
    ).toHaveProperty('selected', false);
    expect(
      component
        .find(RecentItem)
        .at(1)
        .props(),
    ).toHaveProperty('selected', true);
    component.unmount();
  });
});
