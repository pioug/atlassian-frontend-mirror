import React from 'react';

import { queryByAttribute, render, screen } from '@testing-library/react';

import { UNSAFE_Text as Text } from '../../../index';

describe('Text component', () => {
  it('should render given text', () => {
    render(<Text>Text</Text>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should not render redundant DOM nodes', () => {
    render(
      <Text testId="test">
        <Text>Text</Text>
      </Text>,
    );
    expect(screen.getByTestId('test')).toMatchInlineSnapshot(`
      .emotion-0 {
        box-sizing: border-box;
        margin: var(--ds-space-0, 0px);
        padding: var(--ds-space-0, 0px);
        font-family: var(--ds-font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif);
      }

      <span
        class="emotion-0"
        data-testid="test"
      >
        Text
      </span>
    `);
  });

  it('should render with given test id', () => {
    render(<Text testId="test">Text</Text>);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should render with id attribute', () => {
    const id = 'some-id';
    const { container } = render(<Text id={id}>Text</Text>);
    const queryById = queryByAttribute.bind(null, 'id');
    const component = queryById(container, id);
    expect(component).toBeDefined();
  });

  describe('"as" prop behaviour', () => {
    it('renders without errors when a valid "as" value is given', () => {
      render(<Text as="div">Text</Text>);
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('throws when an invalid "as" value is given', () => {
      // @ts-ignore purposefully providing an invalid value to test invariant behaviour
      expect(() => render(<Text as="address">Text</Text>)).toThrow(
        new Error(
          'Invariant failed: @atlaskit/ds-explorations: Text received an invalid "as" value of "address"',
        ),
      );
    });
  });
});
