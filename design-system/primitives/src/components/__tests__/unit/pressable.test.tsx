import React, { Fragment } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { xcss } from '../../../xcss/xcss';
import Pressable from '../../pressable';

const testId = 'test-pressable';

const pressableStyles = xcss({
  textTransform: 'uppercase',
});

describe('Pressable', () => {
  it('should render with a given test id', () => {
    render(<Pressable testId={testId}>Pressable with testid</Pressable>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should render a <button>', () => {
    render(<Pressable testId={testId}>Pressable</Pressable>);
    expect(screen.getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should be type `button` by default', () => {
    render(<Pressable testId={testId}>Pressable</Pressable>);
    expect(screen.getByTestId(testId)).toHaveAttribute('type', 'button');
  });

  it('should only render a <button> regardless of Box `as` prop override', () => {
    render(
      <Pressable
        // The `as` prop isn't allowed by types, but we should
        // confirm the primitive can't be intentionally misused by
        // forwarding this prop to Box.
        // @ts-expect-error
        as="a"
        href="atlassian.design"
        testId={testId}
      >
        Pressable
      </Pressable>,
    );
    expect(screen.getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should render plain text as children', () => {
    render(<Pressable testId={testId}>Pressable text</Pressable>);
    const element = screen.getByText('Pressable text');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Pressable testId={testId}>
        <span data-testid="test-pressable-child">Pressable children</span>
      </Pressable>,
    );
    const parent = screen.getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = screen.getByTestId('test-pressable-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply aria attributes', () => {
    render(
      <Fragment>
        <Pressable testId="pressed" aria-pressed="true">
          Mute sound
        </Pressable>
        <Pressable testId="haspopup" aria-haspopup="menu">
          Menu
        </Pressable>
      </Fragment>,
    );
    expect(screen.getByTestId('pressed')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByTestId('haspopup')).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });

  it('should disable the button using `isDisabled` prop', () => {
    render(
      <Pressable testId={testId} isDisabled>
        Disabled
      </Pressable>,
    );
    expect(screen.getByTestId(testId)).toBeDisabled();
  });

  it('should call click handler when present', () => {
    const mockOnClick = jest.fn();

    render(
      <Pressable testId={testId} onClick={mockOnClick}>
        Click me
      </Pressable>,
    );

    fireEvent.click(screen.getByTestId(testId));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply styles with `xcss`', () => {
    render(
      <Pressable testId={testId} xcss={pressableStyles}>
        Pressable with xcss styles
      </Pressable>,
    );

    const styles = getComputedStyle(screen.getByTestId(testId));
    expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
  });
});
