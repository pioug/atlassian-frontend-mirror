import React from 'react';

import { queryByAttribute, render } from '@testing-library/react';

import Text from '../../text';

describe('Text component', () => {
  it('should render given text', () => {
    const { getByText } = render(<Text>Text</Text>);
    expect(getByText('Text')).toBeInTheDocument();
  });

  it('should not render redundant DOM nodes', () => {
    const { getByTestId } = render(
      <Text testId="test">
        <Text>Text</Text>
      </Text>,
    );
    expect(getByTestId('test')).toMatchInlineSnapshot(`
      .emotion-0 {
        font: var(--ds-font-body, normal 400 14px/20px var(--ds-font-family-body));
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
    const { getByTestId } = render(<Text testId="test">Text</Text>);
    expect(getByTestId('test')).toBeInTheDocument();
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
      const { getByText } = render(<Text as="span">Text</Text>);
      expect(getByText('Text')).toBeInTheDocument();
    });

    it('throws when an invalid "as" value is given', () => {
      // @ts-ignore purposefully providing an invalid value to test invariant behaviour
      expect(() => render(<Text as="label">Text</Text>)).toThrow(
        new Error(
          'Invariant failed: @atlaskit/primitives: Text received an invalid "as" value of "label"',
        ),
      );
    });
  });
});
