import React from 'react';
import LinkSearchList, {
  LinkSearchListProps,
  testIds,
} from '../../link-picker/link-search-list';
import { getDefaultItems } from '../__helpers';
import { renderWithIntl as render } from '@atlaskit/link-test-helpers';

interface SetupOptions extends LinkSearchListProps {}

describe('<LinkSearchList />', () => {
  const setup = (userOptions: Partial<SetupOptions> = {}) => {
    const defaultOptions = {
      items: getDefaultItems(),
      isLoading: false,
      onChange: jest.fn(),
      onSelect: jest.fn(),
      onKeyDown: jest.fn(),
      selectedIndex: -1,
      activeIndex: -1,
      ariaControls: '',
      ariaLabelledBy: '',
      role: '',
      id: '',
    } as const;
    const options = {
      ...defaultOptions,
      ...userOptions,
    };

    const component = render(<LinkSearchList {...options} />);

    return {
      component,
      items: options.items,
      onSelect: options.onSelect,
    };
  };

  it('should render the list items and no loading when loaded', () => {
    const { component, items } = setup();
    const list = component.getByTestId('link-search-list');

    expect(list.children).toHaveLength(items!.length);
    expect(() =>
      component.getByTestId(testIds.searchResultLoadingIndicator),
    ).toThrow();
  });

  it('should render iconUrl in an img tag', () => {
    const { component, items } = setup();
    const image = component.getByAltText('List item 1');

    expect(image.getAttribute('alt')).toMatch('List item 1');
    expect(image.getAttribute('src')).toMatch(`${items![0].icon}`);
  });

  it('should render a spinner when loading and not items', () => {
    const { component } = setup({
      isLoading: true,
      items: undefined,
    });

    expect(() =>
      component.getByTestId(testIds.searchResultLoadingIndicator),
    ).not.toThrow();
    expect(() => component.getByTestId('link-search-list')).toThrow();
  });

  it('should render list and spinner when loading and has items', () => {
    const { component, items } = setup({
      isLoading: true,
    });
    const spinner = component.getByTestId(testIds.searchResultLoadingIndicator);
    const list = component.getByTestId('link-search-list');

    expect(spinner).toBeDefined();
    expect(list.children).toHaveLength(items!.length);
  });

  it('should not render list when there are no items', () => {
    const { component } = setup({ items: [] });
    expect(() => component.getByTestId('link-search-list')).toThrow();
  });

  it('should pre-select the item on selectedIndex', () => {
    const { component } = setup({
      selectedIndex: 1,
    });
    const list = component.getByTestId('link-search-list');

    expect(list.children[0].getAttribute('aria-selected')).toBe('false');
    expect(list.children[1].getAttribute('aria-selected')).toBe('true');
  });
});
