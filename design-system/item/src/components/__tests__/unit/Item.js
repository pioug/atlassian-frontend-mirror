import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Item, { itemThemeNamespace } from '../../..';

describe('@atlaskit/item - Item', () => {
  const user = userEvent.setup();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root element type', () => {
    describe('if href prop supplied', () => {
      it('should match props.linkComponent if supplied', () => {
        const MyLinkComponent = () => <span data-testid="link-component" />;
        render(<Item href="//atlassian.com" linkComponent={MyLinkComponent} />);

        expect(screen.getByTestId('link-component')).toBeInTheDocument();
      });

      it('should be <a> if props.linkComponent not supplied', () => {
        render(<Item href="//atlassian.com" data-testid="link-component" />);

        const linkComponent = screen.getByTestId('link-component');

        expect(linkComponent).toBeInTheDocument();
        expect(linkComponent.tagName).toBe('A');
        expect(linkComponent).toHaveAttribute('href', '//atlassian.com');
      });

      it('should be <span> if props.linkComponent not supplied but props.isDisabled = true', () => {
        render(
          <Item
            href="//atlassian.com"
            isDisabled
            data-testid="disabled-link-component"
          />,
        );

        const linkComponent = screen.getByTestId('disabled-link-component');

        expect(linkComponent.tagName).toBe('SPAN');
        expect(linkComponent).toHaveAttribute('href', '//atlassian.com');
        expect(linkComponent).toHaveAttribute('aria-disabled', 'true');
      });
    });

    describe('if href prop not supplied', () => {
      it('should be a <span>', () => {
        render(<Item data-testid="link-component" />);

        expect(screen.getByTestId('link-component').tagName).toBe('SPAN');
      });
    });
  });

  describe('event handling and patching', () => {
    describe('click', () => {
      describe('without drag and drop', () => {
        it('should allow clicking when item is not disabled', async () => {
          const myMock = jest.fn();
          render(<Item onClick={myMock} />);

          await user.click(screen.getByRole('button'));

          await waitFor(() => expect(myMock).toHaveBeenCalledTimes(1));
        });

        it('should not allow clicking when item is disabled', async () => {
          const myMock = jest.fn();
          render(<Item onClick={myMock} isDisabled />);

          await user.click(screen.getByRole('button'));

          await waitFor(() => expect(myMock).not.toHaveBeenCalled());
        });

        it('should not do anything if no click handler is provided', async () => {
          render(<Item />);

          await waitFor(() =>
            expect(() => user.click(screen.getByRole('button'))).not.toThrow(),
          );
        });
      });

      describe('with drag and drop', () => {
        describe('react-beautiful-dnd support 10.x - 12.x', () => {
          it('should call the original function rbd does not prevent the click', async () => {
            const onClick = jest.fn();
            const dnd = {
              draggableProps: {},
              dragHandleProps: {},
              innerRef: () => {},
            };
            render(<Item onClick={onClick} dnd={dnd} />);

            await user.click(screen.getByRole('button'));

            await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
          });
        });
      });
    });

    describe('mousedown', () => {
      describe('react-beautiful-dnd 10.x and 11.x API', () => {
        it('should fire the drag and drop handler if provided', async () => {
          const dnd = {
            dragHandleProps: {
              onMouseDown: jest.fn(),
            },
            innerRef: () => {},
            draggableProps: {},
          };
          render(<Item dnd={dnd} />);

          await user.click(screen.getByRole('button'));

          await waitFor(() =>
            expect(dnd.dragHandleProps.onMouseDown).toHaveBeenCalledTimes(1),
          );
        });

        it('should call the dragHandle function even if disabled - dnd has its own disabled mechanism', async () => {
          const dnd = {
            dragHandleProps: {
              onMouseDown: jest.fn(),
            },
            innerRef: () => {},
            draggableProps: {},
          };
          render(<Item dnd={dnd} isDisabled />);

          await user.click(screen.getByRole('button'));

          await waitFor(() =>
            expect(dnd.dragHandleProps.onMouseDown).toHaveBeenCalledTimes(1),
          );
        });
      });
    });

    describe('keydown', () => {
      describe('without drag and drop', () => {
        it('should call the provided onKeyDown prop', async () => {
          const onKeyDown = jest.fn();
          render(<Item onKeyDown={onKeyDown} />);

          const item = screen.getByRole('button');
          await item.focus();
          await user.keyboard('{Shift}');

          await waitFor(() => expect(onKeyDown).toHaveBeenCalledTimes(1));
        });

        it('should not call the prop if disabled', async () => {
          const onKeyDown = jest.fn();
          render(<Item isDisabled onKeyDown={onKeyDown} />);

          const item = screen.getByRole('button');
          await item.focus();
          await user.keyboard('{Shift}');

          await waitFor(() => expect(onKeyDown).not.toHaveBeenCalled());
        });

        it('should do nothing if prop is not provided', async () => {
          render(<Item />);

          await screen.getByRole('button').focus();

          await waitFor(() =>
            expect(() => user.keyboard('{Shift}')).not.toThrow(),
          );
        });
      });

      describe('with drag and drop', () => {
        describe('react-beautiful-dnd 10.x and 11.x API', () => {
          it('should call the original function if no dragHandle onKeyDown is provided', async () => {
            const dnd = {
              dragHandleProps: undefined,
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            render(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            const item = screen.getByRole('button');
            await item.focus();
            await user.keyboard('{Shift}');

            await waitFor(() => expect(onKeyDown).toHaveBeenCalled());
          });

          it('should execute the dragHandle function if provided', async () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn((event) => event.preventDefault),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            render(<Item dnd={dnd} />);

            const item = screen.getByRole('button');
            await item.focus();
            await user.keyboard('{Shift}');

            await waitFor(() =>
              expect(dnd.dragHandleProps.onKeyDown).toHaveBeenCalled(),
            );
          });

          it('should not call the original function if the dragHandle prevents the default', async () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn((event) => event.preventDefault()),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            render(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            const item = screen.getByRole('button');
            await item.focus();
            await user.keyboard('{Shift}');

            await waitFor(() => expect(onKeyDown).not.toHaveBeenCalled());
          });

          it('should not call the original function if the item is dragging', async () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn(),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            render(<Item dnd={dnd} onKeyDown={onKeyDown} isDragging />);

            const item = screen.getByRole('button');
            await item.focus();
            await user.keyboard('{Shift}');

            await waitFor(() => expect(onKeyDown).not.toHaveBeenCalled());
          });

          it('should call the original function if the dragHandle does not prevent default', async () => {
            const dnd = {
              dragHandleProps: {
                onKeyDown: jest.fn(),
              },
              innerRef: () => {},
              draggableProps: {},
            };
            const onKeyDown = jest.fn();
            render(<Item dnd={dnd} onKeyDown={onKeyDown} />);

            const item = screen.getByRole('button');
            await item.focus();
            await user.keyboard('{Shift}');

            await waitFor(() => expect(onKeyDown).toHaveBeenCalled());
          });
        });
      });
    });
  });

  describe('auto focus', () => {
    it('should not try to focus is autoFocus is false', () => {
      render(<Item />);

      expect(screen.getByRole('button')).not.toHaveFocus();
    });

    it('should focus on mount if autoFocus is set to true', () => {
      render(<Item autoFocus />);

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('should not try to focus on prop changes after mounting', () => {
      // mounting without autofocus
      const { rerender } = render(<Item />);

      expect(screen.getByRole('button')).not.toHaveFocus();

      rerender(<Item autoFocus />);

      // should make no difference
      expect(screen.getByRole('button')).not.toHaveFocus();
    });
  });

  it('should not have focus ring when clicked', async () => {
    render(<Item />);

    const linkComponent = screen.getByRole('button');
    await user.click(linkComponent);

    await waitFor(() => expect(linkComponent).not.toHaveFocus());
  });

  describe('shouldAllowMultiline prop', () => {
    it('should be passed to the Content element', () => {
      render(<Item shouldAllowMultiline />);

      expect(screen.getByTestId('item-content')).toHaveStyle(
        'white-space: normal',
      );
    });
  });

  describe('optional layout props', () => {
    const testElem = <div data-testid="test-element" />;

    it('elemBefore should be rendered if supplied', () => {
      render(<Item elemBefore={testElem} />);

      expect(screen.getByTestId('test-element')).toBeInTheDocument();
    });

    it('description should be rendered if supplied', () => {
      render(<Item description="Description text" />);

      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('elemAfter should only rendered if supplied', () => {
      render(<Item elemAfter={testElem} />);

      expect(screen.getByTestId('test-element')).toBeInTheDocument();
    });

    it('should hide element if props.isHidden = true', () => {
      render(<Item isHidden testId="link-component" />);

      expect(screen.queryByTestId('link-component')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    describe('role', () => {
      it('root element should have role="button"', () => {
        render(<Item />);

        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('should accept role as an optional prop', () => {
        render(<Item role="menuitem" />);

        expect(screen.getByRole('menuitem')).toBeInTheDocument();
      });
    });

    it('should set aria-disabled based on props.isDisabled', () => {
      render(<Item isDisabled="true" />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('should set title prop on root element', () => {
      render(<Item title="Item title" />);

      expect(screen.getByRole('button')).toHaveAttribute('title', 'Item title');
    });

    describe('tabIndex = 0', () => {
      it('should be applied by default', () => {
        render(<Item />);

        expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
      });

      it('should not be applied if props.href has a value', () => {
        render(<Item href="#foo" />);

        expect(screen.getByRole('button')).not.toHaveAttribute('tabIndex');
      });

      it('should not be applied if props.isDisabled = true', () => {
        render(<Item isDisabled />);

        expect(screen.getByRole('button')).not.toHaveAttribute('tabIndex');
      });
    });
  });

  describe('theme exports', () => {
    it('should export a named itemThemeNamespace string', () => {
      expect(itemThemeNamespace).toBe('@atlaskit-shared-theme/item');
    });
  });
});
