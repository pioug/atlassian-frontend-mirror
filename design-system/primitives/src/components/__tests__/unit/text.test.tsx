import React from 'react';

import { queryByAttribute, render, screen } from '@testing-library/react';

import Text from '../../text';

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
        margin: 0;
        font: var(--ds-font-body, normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif);
        color: var(--ds-text, #172B4D);
      }

      <p
        class="emotion-0"
        data-testid="test"
      >
        Text
      </p>
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
      render(<Text as="span">Text</Text>);
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('throws when an invalid "as" value is given', () => {
      // @ts-ignore purposefully providing an invalid value to test invariant behaviour
      expect(() => render(<Text as="address">Text</Text>)).toThrow(
        new Error(
          'Invariant failed: @atlaskit/primitives: Text received an invalid "as" value of "address"',
        ),
      );
    });
  });
});
