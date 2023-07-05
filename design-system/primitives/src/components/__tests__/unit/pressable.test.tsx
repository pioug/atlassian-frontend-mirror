/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import { fireEvent, render } from '@testing-library/react';

import Pressable from '../../pressable';

const testId = 'test-pressable';

const pressableStyles = css({
  textTransform: 'uppercase',
});

describe('Pressable component', () => {
  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Pressable testId={testId}>Pressable with testid</Pressable>,
    );

    expect(getByTestId(testId)).toBeInTheDocument();
  });

  it('should render a <button>', () => {
    const { getByTestId } = render(
      <Pressable testId={testId}>Pressable</Pressable>,
    );
    expect(getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should be type `button` by default', () => {
    const { getByTestId } = render(
      <Pressable testId={testId}>Pressable</Pressable>,
    );
    expect(getByTestId(testId).getAttribute('type')).toEqual('button');
  });

  it('should only render a <button> regardless of Box `as` prop override', () => {
    const { getByTestId } = render(
      <Pressable
        // The `as` prop isn't allowed by types, but we should
        // confirm the primitive can't be intentionally misused by
        // forwarding this prop to Box.
        // @ts-expect-error
        as="a"
        testId={testId}
      >
        Pressable
      </Pressable>,
    );
    expect(getByTestId(testId).nodeName).toEqual('BUTTON');
  });

  it('should render plain text as children', () => {
    const { getByText } = render(
      <Pressable testId={testId}>Pressable text</Pressable>,
    );
    const element = getByText('Pressable text');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <Pressable testId={testId}>
        <span data-testid="test-pressable-child">Pressable children</span>
      </Pressable>,
    );
    const parent = getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = getByTestId('test-pressable-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply aria attributes', () => {
    /**
     * Renders other button butons
     * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
     */
    const { getByTestId } = render(
      <Fragment>
        <Pressable testId="pressed" aria-pressed="true">
          Mute sound
        </Pressable>
        <Pressable testId="haspopup" aria-haspopup="menu">
          Menu
        </Pressable>
      </Fragment>,
    );
    expect(getByTestId('pressed').getAttribute('aria-pressed')).toBe('true');
    expect(getByTestId('haspopup').getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should disable the button using `isDisabled` prop', () => {
    const { getByTestId } = render(
      <Pressable testId={testId} isDisabled>
        Disabled
      </Pressable>,
    );
    expect(getByTestId(testId)).toBeDisabled();
  });

  it('should call click handler when present', () => {
    const mockOnClick = jest.fn();

    const { getByTestId } = render(
      <Pressable testId={testId} onClick={mockOnClick}>
        Click me
      </Pressable>,
    );

    fireEvent.click(getByTestId(testId));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply styles with `css`', () => {
    const { getByTestId } = render(
      <Pressable testId={testId} css={pressableStyles}>
        Pressable with css styles
      </Pressable>,
    );

    const styles = getComputedStyle(getByTestId(testId));
    expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
  });
});
