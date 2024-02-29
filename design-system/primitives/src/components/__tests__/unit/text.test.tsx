import React from 'react';

import { queryByAttribute, render, screen } from '@testing-library/react';

import Text from '../../text';

describe('Text component', () => {
  it('should render given text', () => {
    render(<Text>Text</Text>);
    expect(screen.getByText('Text')).toBeInTheDocument();
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
    it('renders as the correct element with a valid "as" attribute', () => {
      render(
        <>
          <Text>Default</Text>
          <Text as="span">Span</Text>
          <Text as="p">Paragraph</Text>
          <Text as="strong">Strong</Text>
          <Text as="em">Emphasis</Text>
        </>,
      );
      expect(screen.getByText('Default').tagName.toLowerCase()).toBe('span');
      expect(screen.getByText('Span').tagName.toLowerCase()).toBe('span');
      expect(screen.getByText('Paragraph').tagName.toLowerCase()).toBe('p');
      expect(screen.getByText('Strong').tagName.toLowerCase()).toBe('strong');
      expect(screen.getByText('Emphasis').tagName.toLowerCase()).toBe('em');
    });

    it('throws with an invalid "as" attribute', () => {
      // @ts-ignore purposefully providing an invalid value to test invariant behaviour
      expect(() => render(<Text as="address">Text</Text>)).toThrow(
        new Error(
          'Invariant failed: @atlaskit/primitives: Text received an invalid "as" value of "address"',
        ),
      );
    });
  });
});
