import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Item, { ItemGroup } from '@atlaskit/item';

import { DroplistWithoutAnalytics as Droplist } from '../../components/Droplist';
import DroplistWithAnalytics from '../../index';
import { getDefaultMaxHeight } from '../../styled/Droplist';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  };
});

const itemsList = (
  <ItemGroup label="test--item--group">
    <Item>Some text</Item>
  </ItemGroup>
);

describe('@atlaskit/droplist - core', () => {
  it('should be possible to create a component', () => {
    const { container } = render(<Droplist />);
    expect(container).not.toBeEmptyDOMElement();
  });

  it('should render correctly', () => {
    render(
      <Droplist trigger="test trigger" isOpen maxHeight={100} testId="test">
        {itemsList}
      </Droplist>,
    );

    const content = screen.getByTestId('test--content');
    const trigger = screen.getByText('test trigger');
    const itemGroup = screen.getByRole('group', {
      name: 'test--item--group',
    });
    expect(content).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(itemGroup).toBeInTheDocument();
  });

  describe('max height (appearance prop)', () => {
    it('should constrain max height on content by default', () => {
      render(<Droplist isOpen testId="test" />);

      const expectedHeight = getDefaultMaxHeight();
      const content = screen.getByTestId('test--content');
      expect(content).toHaveStyle(`max-height: ${expectedHeight}px`);
    });

    it('should not set max height if appearance = tall', () => {
      render(<Droplist isOpen appearance="tall" testId="test" />);

      const content = screen.getByTestId('test--content');
      expect(content).toHaveStyle('max-height: 90vh');
    });
  });

  describe('onOpenChange', () => {
    it('should be open when the isOpen property set to true', () => {
      const { rerender } = render(
        <Droplist testId="test">{itemsList}</Droplist>,
      );

      const getContent = () => screen.queryByTestId('test--content');
      const getItemGroup = () =>
        screen.queryByRole('group', {
          name: 'test--item--group',
        });

      expect(getContent()).not.toBeInTheDocument();
      expect(getItemGroup()).not.toBeInTheDocument();

      rerender(
        <Droplist isOpen testId="test">
          {itemsList}
        </Droplist>,
      );

      expect(getContent()).toBeInTheDocument();
      expect(getItemGroup()).toBeInTheDocument();
    });

    it('should not call onOpenChange when Escape key pressed if already closed', () => {
      const onOpenSpy = jest.fn();
      render(
        <Droplist trigger="text" isOpen={false} onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      fireEvent.keyDown(document, {
        key: 'Escape',
      });

      expect(onOpenSpy).not.toHaveBeenCalled();
    });

    it('should set isOpen property to false when Escape key pressed', () => {
      const onOpenSpy = jest.fn();
      render(
        <Droplist trigger="text" isOpen onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      fireEvent.keyDown(document, {
        key: 'Escape',
      });
      expect(onOpenSpy).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });

    it('should set isOpen property to false when Esc key pressed (emulating IE/Edge)', () => {
      const onOpenSpy = jest.fn();
      render(
        <Droplist trigger="text" isOpen onOpenChange={onOpenSpy}>
          {itemsList}
        </Droplist>,
      );

      fireEvent.keyDown(document, {
        key: 'Esc',
      });
      expect(onOpenSpy).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });
  });

  describe('loading', () => {
    it('should show a Spinner (and no Groups) when it is loading and open', () => {
      render(
        <Droplist isLoading isOpen testId="test">
          {itemsList}
        </Droplist>,
      );
      const spinner = screen.getByTestId('test--spinner');
      expect(spinner).toBeInTheDocument();

      const itemGroup = screen.queryByRole('group', {
        name: 'test--item--group',
      });
      expect(itemGroup).not.toBeInTheDocument();
    });

    it('should not show a Spinner when it is loading but not open', () => {
      render(
        <Droplist isLoading testId="test">
          {itemsList}
        </Droplist>,
      );
      const spinner = screen.queryByTestId('test--spinner');
      expect(spinner).not.toBeInTheDocument();
    });
  });
});

describe('DroplistWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should render without errors', () => {
    render(<DroplistWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
