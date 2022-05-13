import React, { MouseEvent } from 'react';

import { waitFor } from '@testing-library/dom';
import {
  render,
  waitForDomChange,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { mount } from 'enzyme';

import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

import DrawerPrimitive from '../../primitives';
import ContentOverrides from '../../primitives/content';
import SidebarOverrides from '../../primitives/sidebar';
import { DrawerWidth } from '../../types';

const DrawerContent = () => <code>Drawer contents</code>;

describe('Drawer primitive', () => {
  const commonProps = {
    testId: 'test',
    width: 'wide' as DrawerWidth,
    in: true,
    shouldUnmountOnExit: false,
    onClose: () => null,
  };

  it('should render given icon in large size if exists', () => {
    const props = { ...commonProps, icon: () => <span>Icon</span> };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect((wrapper.find(props.icon).props() as any).size).toBe('large');
  });

  it('should render arrow left if icon prop does NOT exist', () => {
    const props = { ...commonProps };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(wrapper.find(ArrowLeft).length).toBe(1);
  });

  it('should unmount the node if receives shouldUnmountOnExit prop', async () => {
    const props = { ...commonProps, shouldUnmountOnExit: true };

    const { getByTestId, queryByTestId, rerender } = render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(getByTestId('test')).toBeInTheDocument();

    rerender(
      <DrawerPrimitive {...props} in={false}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    await waitFor(() => expect(queryByTestId('test')).not.toBeInTheDocument());
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

    const { getByTestId, rerender } = render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(getByTestId('test')).toBeInTheDocument();

    rerender(
      <DrawerPrimitive {...props} in={false}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    await waitFor(() => expect(onCloseComplete).toHaveBeenCalled());
    expect(getByTestId('test')).toBeInTheDocument();
  });

  it('should render with medium width', () => {
    const props = { ...commonProps, width: 'medium' as DrawerWidth };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(wrapper.find(DrawerPrimitive).props().width).toBe('medium');
  });

  it('should call onClose when the icon is clicked', () => {
    const onClose = jest.fn();
    const props = { ...commonProps, onClose };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    const event = { target: 'button' };
    const callsBeforeIconClick = Array.prototype.concat(onClose.mock.calls);

    const handler = wrapper.find('IconButton').prop('onClick');
    if (handler) {
      handler((event as unknown) as MouseEvent);
    }

    const callsAfterIconClick = onClose.mock.calls;

    expect({ callsBeforeIconClick, callsAfterIconClick }).toEqual({
      callsBeforeIconClick: [],
      callsAfterIconClick: [[event]],
    });
  });

  it('should call onCloseComplete when the Slide has exited', async () => {
    const onCloseComplete = jest.fn();

    const props = {
      ...commonProps,
      onCloseComplete,
      shouldUnmountOnExit: true,
    };

    const { queryByTestId, rerender } = render(
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

    await waitForElementToBeRemoved(() => queryByTestId(props.testId));
    expect(onCloseComplete).toHaveBeenCalledTimes(1);
    expect(onCloseComplete).toHaveBeenCalledWith(null);
  });

  it('should call onOpenComplete when the Slide has finished entering (entered)', async () => {
    const onOpenComplete = jest.fn();
    const props = { ...commonProps, in: true, onOpenComplete };
    const { getByTestId } = render(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    const drawer = getByTestId('test');

    /**
     * The thinking behind this is that the className should change when the
     * animation has finished.
     */
    await waitForDomChange({
      container: drawer,
      mutationObserverOptions: {
        attributes: true,
        childList: false,
        subtree: false,
      },
    });

    expect(onOpenComplete).toHaveBeenCalledTimes(1);
    expect(onOpenComplete).toHaveBeenCalledWith(drawer);
  });

  describe('overrides', () => {
    const overrides = [
      {
        name: 'Sidebar',
        defaultComponent: SidebarOverrides.component,
        component: jest.fn(() => <div data-testid="sidebar-override" />),
        cssFn: jest.fn(),
        testId: 'sidebar-override',
      },
      {
        name: 'Content',
        defaultComponent: ContentOverrides.component,
        component: jest.fn(() => <div data-testid="content-override" />),
        cssFn: jest.fn(),
        testId: 'content-override',
      },
    ];

    overrides.forEach(
      ({ name, component, defaultComponent, cssFn, testId }) => {
        it(`should be able to override the ${name} component by providing a component override`, () => {
          const props = {
            ...commonProps,
            overrides: {
              [name]: {
                component,
              },
            },
          };
          const { getByTestId } = render(
            <DrawerPrimitive {...props}>
              <DrawerContent />
            </DrawerPrimitive>,
          );

          expect(getByTestId(testId)).toBeInTheDocument();
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
      },
    );
  });
});
