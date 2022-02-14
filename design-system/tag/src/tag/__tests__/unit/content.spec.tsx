import React from 'react';

import { render } from '@testing-library/react';

import Content from '../../internal/shared/content';

describe('<Content />', () => {
  describe('plain text content', () => {
    it('should be a span', () => {
      const { getByText } = render(<Content text="text" />);
      const content = getByText('text');

      expect(content.tagName).toBe('SPAN');
    });
  });

  describe('link content', () => {
    it('should be a link if it has a href', () => {
      const { getByText } = render(<Content href="/somewhere" text="text" />);
      const content = getByText('text');

      expect(content.tagName).toBe('A');
      expect(content).toHaveAttribute('href', '/somewhere');
    });

    it('should set the data-color attribute', () => {
      const { getByText } = render(
        <Content color="blueLight" href="/somewhere" text="text" />,
      );
      const content = getByText('text');

      expect(content.dataset).toHaveProperty('color', 'blueLight');
    });

    it('should use the given linkComponent', () => {
      const { getByText } = render(
        <Content
          linkComponent={(props) => <div {...props} />}
          href="/somewhere"
          text="text"
        />,
      );
      const content = getByText('text');

      expect(content.tagName).toBe('DIV');
      expect(content).toHaveAttribute('href', '/somewhere');
    });

    describe('standard color', () => {
      it('should not have a text color set', () => {
        const { getByText } = render(<Content href="/somewhere" text="text" />);
        const content = getByText('text');
        const styles = getComputedStyle(content);

        expect(styles.getPropertyValue('color')).toBe('');
      });

      it('should not have text decoration', () => {
        const { getByText } = render(<Content href="/somewhere" text="text" />);
        const content = getByText('text');

        expect(content).toHaveStyleDeclaration('text-decoration', 'none');
      });
    });

    describe('non-standard color', () => {
      it('should inherit text color', () => {
        const { getByText } = render(
          <Content color="blueLight" href="/somewhere" text="text" />,
        );
        const content = getByText('text');

        expect(content).toHaveStyleDeclaration('color', 'inherit');
      });

      it('should have an underline', () => {
        const { getByText } = render(
          <Content color="blueLight" href="/somewhere" text="text" />,
        );
        const content = getByText('text');

        expect(content).toHaveStyleDeclaration('text-decoration', 'underline');
      });
    });
  });
});
