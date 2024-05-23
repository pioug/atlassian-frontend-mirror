import React from 'react';

import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import EmojiIcon from '@atlaskit/icon/glyph/emoji';

import DrawerPrimitive from '../../primitives';
import { wrapperWidth } from '../../primitives/drawer-wrapper';
import { DrawerWidth } from '../../types';

const DrawerContent = () => (
  <code data-testid="DrawerContents">Drawer contents</code>
);

describe('Drawer primitive', () => {
  const commonProps = {
    testId: 'test',
    width: 'wide' as DrawerWidth,
    in: true,
    shouldUnmountOnExit: false,
    label: 'Default drawer',
    onClose: () => null,
  };

  it('should render given icon in large size if exists', () => {
    const Icon = (props: { size: string }) => {
      return <span data-size={props.size}>Icon</span>;
    };
    const props = {
      ...commonProps,
      icon: Icon,
    };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(screen.getByText('Icon')).toHaveAttribute('data-size', 'large');
  });

  it('should not overwrite the accessible name if given an icon', () => {
    const props = { ...commonProps, icon: EmojiIcon };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
  });

  it('should render close control if icon prop does NOT exist', () => {
    const props = { ...commonProps };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
  });

  it('should render close control with custom label if closeLabel is supplied', () => {
    const closeLabel = 'Go back';
    const props = { ...commonProps, closeLabel: closeLabel };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(screen.getByLabelText(closeLabel)).toBeInTheDocument();
  });

  it('should unmount the node if receives shouldUnmountOnExit prop', async () => {
    const props = { ...commonProps, shouldUnmountOnExit: true };

    const { rerender } = render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(screen.getByTestId('test')).toBeInTheDocument();

    rerender(
      <DrawerPrimitive {...props} in={false}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('test')).not.toBeInTheDocument(),
    );
  });

  /**
   * TODO:
   * Worked on the primitive until now, but not the exported drawer component
   * since version 4.1.4 was released 3 years ago.
   * i.e. the exported drawer will ALWAYS unmount on exit.
   *
   * This test's coverage isn't very useful, and the behavior it checks is hard
   * to replicate with motion (which relies on unmounting for exit animations).
   *
   * See: https://atlaskit.atlassian.com/examples/design-system/drawer/retain-drawer-contents-on-close,
   * which is broken on version 4.1.4+ of drawer.
   */
  it.skip('should NOT unmount the node if shouldUnmountOnExit is false', async () => {
    const onCloseComplete = jest.fn();
    const props = { ...commonProps, onCloseComplete };

    const { rerender } = render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(screen.getByTestId('test')).toBeInTheDocument();

    rerender(
      <DrawerPrimitive {...props} in={false}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    await waitFor(() => expect(onCloseComplete).toHaveBeenCalled());
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should render with medium width', () => {
    const props = { ...commonProps, width: 'medium' as DrawerWidth };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    const drawerWrapper = screen.getByTestId('test');
    expect(drawerWrapper).toHaveStyle(
      `width: ${wrapperWidth['medium'].width}px;`,
    );
  });

  it('should call onClose when the icon is clicked', () => {
    const onClose = jest.fn();
    const props = { ...commonProps, onClose };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(onClose).not.toHaveBeenCalled();

    const iconButton = screen.getByRole('button', { name: 'Close drawer' });
    fireEvent.click(iconButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onCloseComplete when the Slide has exited', async () => {
    const onCloseComplete = jest.fn();

    const props = {
      ...commonProps,
      onCloseComplete,
      shouldUnmountOnExit: true,
    };

    const { rerender } = render(
      <DrawerPrimitive {...props} in>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(onCloseComplete).not.toHaveBeenCalled();

    rerender(
      <DrawerPrimitive {...props} in={false}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    await waitForElementToBeRemoved(() => screen.queryByTestId(props.testId));
    expect(onCloseComplete).toHaveBeenCalledTimes(1);
    expect(onCloseComplete).toHaveBeenCalled();
  });

  it('should call onOpenComplete when the Slide has finished entering (entered)', async () => {
    jest.useFakeTimers();

    const onOpenComplete = jest.fn();
    const props = { ...commonProps, in: true, onOpenComplete };
    render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    const drawer = screen.getByTestId('test');

    expect(onOpenComplete).toHaveBeenCalledTimes(0);

    /**
     * Simulates the animation completing
     */
    jest.runAllTimers();

    expect(onOpenComplete).toHaveBeenCalledTimes(1);
    expect(onOpenComplete).toHaveBeenCalledWith(drawer);

    jest.useRealTimers();
  });

  /**
   * This test is fairly explicit as our DrawerWrapper is quite fragile;
   * we use `node.children[1]` to target our content for a ref, so the DOM should match expected.
   */
  describe('works with our DrawerWrapper ref hack', () => {
    it('should render only two children nodes: Sidebar and Content', async () => {
      render(
        <DrawerPrimitive {...commonProps}>
          <DrawerContent />
        </DrawerPrimitive>,
      );
      const drawer = screen.getByTestId('test');

      expect(drawer.childNodes).toHaveLength(2);

      // Sidebar content:
      expect(drawer.childNodes[0]).toContainElement(
        screen.getByTestId('DrawerPrimitiveSidebarCloseButton'),
      );

      // Content:
      expect(drawer.childNodes[1]).toHaveTextContent('Drawer contents');
      expect(drawer.childNodes[1]).toContainElement(
        screen.getByTestId('DrawerContents'),
      );
    });

    it('with both overrides, should render only two children nodes: Sidebar and Content', async () => {
      render(
        <DrawerPrimitive
          {...commonProps}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides -- Testing the functionality even if it's deprecated
          overrides={{
            Content: {
              component: () => (
                <div data-testid="override-content">Override content</div>
              ),
            },
            Sidebar: {
              component: () => (
                <div data-testid="override-sidebar">Override sidebar</div>
              ),
            },
          }}
        >
          <DrawerContent />
        </DrawerPrimitive>,
      );

      const drawer = screen.getByTestId('test');
      expect(drawer.childNodes).toHaveLength(2);

      // Sidebar content:
      expect(drawer.childNodes[0]).toHaveTextContent('Override sidebar');
      expect(drawer.childNodes[0]).toContainElement(
        screen.getByTestId('override-sidebar'),
      );

      // Content:
      expect(drawer.childNodes[1]).toHaveTextContent('Override content');
      expect(drawer.childNodes[1]).toContainElement(
        screen.getByTestId('override-content'),
      );
    });

    /**
     * WARNING: If both `Content` and `Sidebar` were `() => null`, they throw an error.
     */
    it.each([
      ['Content', 'override-sidebar'],
      ['Sidebar', 'override-content'],
    ] as const)(
      'with overriding %p to return `null` you only get one child node',
      (override, validTestId) => {
        render(
          <DrawerPrimitive
            {...commonProps}
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides -- Testing the functionality even if it's deprecated
            overrides={{
              Content: {
                component: () => (
                  <div data-testid="override-content">Override content</div>
                ),
              },
              Sidebar: {
                component: () => (
                  <div data-testid="override-sidebar">Override sidebar</div>
                ),
              },
              [override]: { component: () => null },
            }}
          >
            <DrawerContent />
          </DrawerPrimitive>,
        );

        const drawer = screen.getByTestId('test');
        expect(drawer.childNodes).toHaveLength(1);

        expect(drawer.childNodes[0]).toHaveTextContent(/Override/);
        expect(drawer.childNodes[0]).toContainElement(
          screen.getByTestId(validTestId),
        );
      },
    );
  });

  describe('overrides', () => {
    const overrides = [
      {
        name: 'Sidebar',
        component: jest.fn(() => <div data-testid="sidebar-override" />),
        cssFn: jest.fn(),
        testId: 'sidebar-override',
      },
      {
        name: 'Content',
        component: jest.fn(() => <div data-testid="content-override" />),
        cssFn: jest.fn(),
        testId: 'content-override',
      },
    ];

    overrides.forEach(({ name, component, cssFn, testId }) => {
      it(`should be able to override the ${name} component by providing a component override`, () => {
        const props = {
          ...commonProps,
          overrides: {
            [name]: {
              component,
            },
          },
        };
        render(
          <DrawerPrimitive {...props}>
            <DrawerContent />
          </DrawerPrimitive>,
        );

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });

      it(`should be able to override the style of the ${name} component by providing a cssFn override`, () => {
        const props = {
          ...commonProps,
          overrides: {
            [name]: {
              cssFn,
            },
          },
        };
        render(
          <DrawerPrimitive {...props}>
            <DrawerContent />
          </DrawerPrimitive>,
        );

        expect(cssFn).toHaveBeenCalled();
      });
    });
  });
});
