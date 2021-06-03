import React from 'react';
import { shallow, mount } from 'enzyme';
import { toClass } from 'recompose';

import Item, { itemThemeNamespace } from '../../..';
import { After, Before, Content, Description } from '../../../styled/ItemParts';

describe('@atlaskit/item - Item', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
    wrapper = undefined;
  });

  describe('root element type', () => {
    describe('if href prop supplied', () => {
      it('should match props.linkComponent if supplied', () => {
        const MyLinkComponent = toClass(() => <span />);

        wrapper = mount(
          <Item href="//atlassian.com" linkComponent={MyLinkComponent} />,
        );
        expect(wrapper.getDOMNode().tagName).toBe('SPAN');
      });

      it('should be <a> if props.linkComponent not supplied', () => {
        wrapper = mount(<Item href="//atlassian.com" />);
        expect(wrapper.getDOMNode().tagName).toBe('A');
      });

      it('should be <span> if props.linkComponent not supplied but props.isDisabled = true', () => {
        wrapper = mount(<Item href="//atlassian.com" isDisabled />);
        expect(wrapper.getDOMNode().tagName).toBe('SPAN');
      });
    });

    describe('if href prop not supplied', () => {
      it('should be a <span>', () => {
        wrapper = mount(<Item />);
        expect(wrapper.getDOMNode().tagName).toBe('SPAN');
      });
    });
  });

  describe('event handling and patching', () => {
    describe('click', () => {
      describe('without drag and drop', () => {
        it('should allow clicking when item is not disabled', () => {
          const myMock = jest.fn();
          wrapper = mount(<Item onClick={myMock} />);

          wrapper.simulate('click');

          expect(myMock).toHaveBeenCalled();
        });

        it('should not allow clicking when item is disabled', () => {
          const myMock = jest.fn();
          wrapper = mount(<Item onClick={myMock} isDisabled />);

          wrapper.simulate('click');

          expect(myMock).not.toHaveBeenCalled();
        });

        it('should not do anything if no click handler is provided', () => {
          wrapper = mount(<Item />);

          expect(() => wrapper.simulate('click')).not.toThrow();
        });
      });

      describe('with drag and drop', () => {
        describe('react-beautiful-dnd support 10.x - 12.x', () => {
          it('should call the original function rbd does not prevent the click', () => {
            const onClick = jest.fn();
            const dnd = {
              draggableProps: {},
              dragHandleProps: {},
              innerRef: () => {},
            };
            wrapper = mount(<Item onClick={onClick} dnd={dnd} />);

            wrapper.simulate('click');

            expect(onClick).toHaveBeenCalled();
          });

          it('should not call the onclick prop if the rbd prevents the click', () => {
            const onClick = jest.fn();
            const dnd = {
              draggableProps: {},
              dragHandleProps: {},
              innerRef: () => {},
            };
            wrapper = mount(<Item onClick={onClick} dnd={dnd} />);

            wrapper.simulate('click', { defaultPrevented: true });

            expect(onClick).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('mousedown', () => {
      it('prevent always default on the event', () => {
        wrapper = mount(<Item />);
        const event = { preventDefault: jest.fn() };

        wrapper.simulate('mousedown', event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      describe('react-beautiful-dnd 10.x and 11.x API', () => {
        it('should fire the drag and drop handler if provided', () => {
          const dnd = {
            dragHandleProps: {
              onMouseDown: jest.fn(),
            },
            innerRef: () => {},
            draggableProps: {},
          };
          wrapper = mount(<Item dnd={dnd} />);

          wrapper.simulate('mousedown');

          expect(dnd.dragHandleProps.onMouseDown).toHaveBeenCalled();
        });

        it('should call the dragHandle function even if disabled - dnd has its own disabled mechanism', () => {
          const dnd = {
            dragHandleProps: {
              onMouseDown: jest.fn(),
            },
            innerRef: () => {},
            draggableProps: {},
          };
          wrapper = mount(<Item dnd={dnd} isDisabled />);

          wrapper.simulate('mousedown');

          expect(dnd.dragHandleProps.onMouseDown).toHaveBeenCalled();
        });
      });
    });

    describe('keydown', () => {
      describe('without drag and drop', () => {
        it('should call the provided onKeyDown prop', () => {
          const onKeyDown = jest.fn();
          wrapper = mount(<Item onKeyDown={onKeyDown} />);

          wrapper.simulate('keydown');

          expect(onKeyDown).toHaveBeenCalled();
        });

        it('should not call the prop if disabled', () => {
          const onKeyDown = jest.fn();
          wrapper = mount(<Item isDisabled onKeyDown={onKeyDown} />);

          wrapper.simulate('keydown');

          expect(onKeyDown).not.toHaveBeenCalled();
        });

        it('should do nothing if prop is not provided', () => {
          wrapper = mount(<Item />);

          expect(() => wrapper.simulate('keydown')).not.toThrow();
        });
      });

      describe('with drag and drop', () => {
        describe('react-beautiful-dnd 12.x API', () => {
          it('should not call the original function if the rbd prevents the default', () => {
            const dnd = {
              dragHandleProps: {},
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            wrapper = mount(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            wrapper.simulate('keydown', { defaultPrevented: true });

            expect(onKeyDown).not.toHaveBeenCalled();
          });
        });

        describe('react-beautiful-dnd 10.x and 11.x API', () => {
          it('should call the original function if no dragHandle onKeyDown is provided', () => {
            const dnd = {
              dragHandleProps: undefined,
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            wrapper = mount(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            wrapper.simulate('keydown');

            expect(onKeyDown).toHaveBeenCalled();
          });

          it('should execute the dragHandle function if provided', () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn((event) => event.preventDefault),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            wrapper = mount(<Item dnd={dnd} />);

            wrapper.simulate('keydown');

            expect(dnd.dragHandleProps.onKeyDown).toHaveBeenCalled();
          });

          it('should call the dragHandle function even if disabled - dnd has its own disabled mechanism', () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn((event) => event.preventDefault),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            wrapper = mount(<Item dnd={dnd} isDisabled />);

            wrapper.simulate('keydown');

            expect(dnd.dragHandleProps.onKeyDown).toHaveBeenCalled();
          });

          it('should not call the original function if the dragHandle prevents the default', () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn((event) => event.preventDefault()),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            wrapper = mount(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            wrapper.simulate('keydown');

            expect(onKeyDown).not.toHaveBeenCalled();
          });

          it('should not call the original function if the item is dragging', () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn(),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            wrapper = mount(
              <Item dnd={dnd} onKeyDown={onKeyDown} isDragging />,
            );

            wrapper.simulate('keydown');

            expect(onKeyDown).not.toHaveBeenCalled();
          });

          it('should call the original function if the dragHandle does not prevent default', () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn(),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            wrapper = mount(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            wrapper.simulate('keydown');

            expect(onKeyDown).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('auto focus', () => {
    let rootElement;

    /**
     * These tests check the focused element via `document.activeElement`.
     *
     * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
     *
     * In order for `document.activeElement` to function as intended we need to explicitly
     * mount it into the DOM. We do this using the `attachTo` property.
     *
     * We mount to a div instead of `document.body` directly to avoid a react render warning.
     */
    beforeAll(() => {
      rootElement = document.createElement('div');
      document.body.appendChild(rootElement);
    });

    afterAll(() => {
      if (rootElement) {
        document.body.removeChild(rootElement);
        rootElement = undefined;
      }
    });

    it('should not try to focus is autoFocus is false', () => {
      wrapper = mount(<Item />, { attachTo: rootElement });

      const node = wrapper.getDOMNode();

      expect(node).not.toBe(document.activeElement);
    });

    it('should focus on mount if autoFocus is set to true', () => {
      wrapper = mount(<Item autoFocus />, { attachTo: rootElement });

      const node = wrapper.getDOMNode();

      expect(node).toBe(document.activeElement);
    });

    it('should not try to focus on prop changes after mounting', () => {
      // mounting without autofocus
      wrapper = mount(<Item />, { attachTo: rootElement });
      const node = wrapper.getDOMNode();
      expect(node).not.toBe(document.activeElement);

      wrapper.setProps({
        autoFocus: true,
      });

      // should make no difference
      expect(node).not.toBe(document.activeElement);
    });
  });

  it('should prevent default onMouseDown event to avoid focus ring when clicked', () => {
    wrapper = mount(<Item />);
    const preventDefault = jest.fn();
    wrapper.simulate('mousedown', { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });

  describe('shouldAllowMultiline prop', () => {
    it('should be passed to the Content element', () => {
      wrapper = mount(<Item />);
      expect(wrapper.find(Content).prop('allowMultiline')).toBe(false);
      wrapper.setProps({ shouldAllowMultiline: true });
      expect(wrapper.find(Content).prop('allowMultiline')).toBe(true);
    });
  });

  describe('optional layout props', () => {
    const testElem = <div className="testElem" />;

    beforeEach(() => {
      wrapper = shallow(<Item />);
    });

    it('elemBefore should only be rendered if supplied', () => {
      expect(wrapper.find(Before).length).toBe(0);
      wrapper.setProps({ elemBefore: testElem });
      expect(wrapper.find(Before).length).toBe(1);
      expect(wrapper.find('.testElem').length).toBe(1);
    });

    it('description should only be rendered if supplied', () => {
      expect(wrapper.find(Description).length).toBe(0);
      wrapper.setProps({ description: 'Description text' });
      expect(wrapper.find(Description).length).toBe(1);
    });

    it('elemAfter should only be rendered if supplied', () => {
      expect(wrapper.find(After).length).toBe(0);
      wrapper.setProps({ elemAfter: testElem });
      expect(wrapper.find(After).length).toBe(1);
      expect(wrapper.find('.testElem').length).toBe(1);
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      wrapper = shallow(<Item />);
    });

    describe('role', () => {
      it('root element should have role="button"', () => {
        expect(wrapper.find('[role="button"]').length).toBe(1);
      });

      it('should accept role as an optional prop', () => {
        expect(wrapper.find('[role="menuitem"]').length).toBe(0);
        wrapper.setProps({ role: 'menuitem' });
        expect(wrapper.find('[role="menuitem"]').length).toBe(1);
      });
    });

    it('should set aria-disabled based on props.isDisabled', () => {
      const isDisabled = () =>
        wrapper.find('[aria-disabled=true]').length === 1;
      expect(isDisabled()).toBe(false);
      wrapper.setProps({ isDisabled: true });
      expect(isDisabled()).toBe(true);
    });

    it('should set title prop on root element', () => {
      wrapper.setProps({ title: 'Item title' });
      expect(wrapper.prop('title')).toBe('Item title');
    });

    describe('tabIndex = 0', () => {
      const hasTabIndex = () => wrapper.find('[tabIndex=0]').length === 1;
      it('should be applied by default', () => {
        expect(hasTabIndex()).toBe(true);
      });
      it('should not be applied if props.href has a value', () => {
        wrapper.setProps({ href: '#foo' });
        expect(hasTabIndex()).toBe(false);
      });
      it('should not be applied if props.isDisabled = true', () => {
        wrapper.setProps({ isDisabled: true });
        expect(hasTabIndex()).toBe(false);
      });
      it('should not be applied if props.isHidden = true', () => {
        wrapper.setProps({ isHidden: true });
        expect(hasTabIndex()).toBe(false);
      });
    });
  });

  describe('theme exports', () => {
    it('should export a named itemThemeNamespace string', () => {
      expect(itemThemeNamespace).toBe('@atlaskit-shared-theme/item');
    });
  });
});
