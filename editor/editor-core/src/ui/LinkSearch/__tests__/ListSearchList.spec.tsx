import React from 'react';
import Spinner from '@atlaskit/spinner';
import LinkSearchList, {
  Props as LinkSearchListProps,
  List as LinkSearchListList,
} from '../LinkSearchList';
import LinkSearchListItem from '../LinkSearchListItem';
import { getDefaultItems } from './__helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

interface SetupOptions extends LinkSearchListProps {}

describe('ListSearchList', () => {
  const setup = (userOptions: Partial<SetupOptions> = {}) => {
    const defaultOptions: Required<SetupOptions> = {
      items: getDefaultItems(),
      isLoading: false,
      onMouseMove: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onSelect: jest.fn(),
      selectedIndex: -1,
      ariaControls: '',
    };
    const options: Required<SetupOptions> = {
      ...defaultOptions,
      ...userOptions,
    };

    const component = mountWithIntl(<LinkSearchList {...options} />);

    return {
      component,
      items: options.items,
      onMouseMove: options.onMouseMove,
      onMouseEnter: options.onMouseEnter,
      onMouseLeave: options.onMouseLeave,
      onSelect: options.onSelect,
    };
  };

  it('should render the list items and no loading when loaded', () => {
    const { component, items } = setup();
    expect(component.find(LinkSearchListItem)).toHaveLength(items.length);
    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('should render iconUrl in an img tag', () => {
    const { component, items } = setup();
    expect(component.find(LinkSearchListItem).at(0).html()).toMatch(
      `<img src="${items[0].iconUrl}" alt="List item">`,
    );
  });

  it('should render a spinner when loading and not items', () => {
    const { component } = setup({
      isLoading: true,
      items: undefined,
    });

    expect(component.find(Spinner)).toHaveLength(1);
    expect(component.find(LinkSearchListItem)).toHaveLength(0);
  });

  it('should render list and spinner when loading and has items', () => {
    const { component, items } = setup({
      isLoading: true,
    });

    expect(component.find(Spinner)).toHaveLength(1);
    expect(component.find(LinkSearchListItem)).toHaveLength(items.length);
  });

  it('should not render list when there are no items', () => {
    const { component } = setup({ items: [] });

    expect(component.find(LinkSearchListList)).toHaveLength(0);
  });

  it('should pass props to item component', () => {
    const {
      component,
      items,
      onSelect,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    } = setup();

    let firstItem = component.find(LinkSearchListItem).at(0);
    const itemProps = firstItem.props();
    expect(itemProps.item).toEqual(items[0]);
    expect(firstItem.key()).toEqual(items[0].objectId);
    expect(itemProps.onSelect).toEqual(onSelect);
    expect(itemProps.onMouseMove).toEqual(onMouseMove);
    expect(itemProps.onMouseEnter).toEqual(onMouseEnter);
    expect(itemProps.onMouseLeave).toEqual(onMouseLeave);
  });

  it('should select the item on selectedIndex', () => {
    const { component } = setup({
      selectedIndex: 1,
    });

    expect(component.find(LinkSearchListItem).at(0).props()).toHaveProperty(
      'selected',
      false,
    );
    expect(component.find(LinkSearchListItem).at(1).props()).toHaveProperty(
      'selected',
      true,
    );
  });
});
