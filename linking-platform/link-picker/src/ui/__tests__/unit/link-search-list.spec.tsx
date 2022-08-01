import React from 'react';
import Spinner from '@atlaskit/spinner';
import LinkSearchList, {
  LinkSearchListProps,
} from '../../link-picker/link-search-list';
import LinkSearchListItem from '../../link-picker/list-item';
import { getDefaultItems } from '../__helpers';
import { mountWithIntl } from '@atlaskit/link-test-helpers';

interface SetupOptions extends LinkSearchListProps {}

describe('<LinkSearchList />', () => {
  const setup = (userOptions: Partial<SetupOptions> = {}) => {
    const defaultOptions: Required<SetupOptions> = {
      items: getDefaultItems(),
      isLoading: false,
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onSelect: jest.fn(),
      selectedIndex: -1,
      activeIndex: -1,
      ariaControls: '',
      ariaLabelledBy: '',
      role: '',
      id: '',
    };
    const options: Required<SetupOptions> = {
      ...defaultOptions,
      ...userOptions,
    };

    const component = mountWithIntl(<LinkSearchList {...options} />);

    return {
      component,
      items: options.items,
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

    const image = component.find(LinkSearchListItem).at(0).render().find('img');

    expect(image.attr('alt')).toMatch('List item');
    expect(image.attr('src')).toMatch(`${items[0].icon}`);
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

    expect(component.find('[data-testid="link-search-list"]')).toHaveLength(0);
  });

  it('should pass props to item component', () => {
    const { component, items, onSelect, onMouseEnter, onMouseLeave } = setup();

    let firstItem = component.find(LinkSearchListItem).at(0);
    const itemProps = firstItem.props();
    expect(itemProps.item).toEqual(items[0]);
    expect(firstItem.key()).toEqual(items[0].objectId);
    expect(itemProps.onSelect).toEqual(onSelect);
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
