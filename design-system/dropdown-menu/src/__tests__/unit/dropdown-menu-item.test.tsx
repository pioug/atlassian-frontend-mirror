import React from 'react';

import { render, screen } from '@testing-library/react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import { DropdownItem } from '../../index';

describe('DropdownMenu Item', () => {
  describe('default menu - button', () => {
    it('simple menu item', () => {
      render(<DropdownItem>Menu</DropdownItem>);
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should have description', () => {
      const desc = 'A long text to describe a menu';
      render(<DropdownItem description={desc}>Menu</DropdownItem>);
      expect(screen.getByText(desc)).toBeInTheDocument();
    });

    describe('icon', () => {
      const uniqueText = 'uniqueText';
      const testId = 'testId';

      it('should have icon before the text', () => {
        render(
          <DropdownItem
            elemBefore={<CheckIcon label={uniqueText} testId={testId} />}
            testId={testId}
          >
            Menu
          </DropdownItem>,
        );

        const iconBefore = screen.getByLabelText(uniqueText);
        const container = screen.getByTestId(
          `${testId}--primitive--icon-before`,
        );
        expect(iconBefore).toBeInTheDocument();
        expect(container).toBeInTheDocument();
      });

      it('should have icon after the text', () => {
        render(
          <DropdownItem
            elemAfter={<CheckIcon label={uniqueText} />}
            testId={testId}
          >
            Menu
          </DropdownItem>,
        );
        const iconBefore = screen.getByLabelText(uniqueText);
        const container = screen.getByTestId(
          `${testId}--primitive--icon-after`,
        );
        expect(iconBefore).toBeInTheDocument();
        expect(container).toBeInTheDocument();
      });

      it('should have icon before and after the text', () => {
        const beforeText = `${uniqueText}Before`;
        const afterText = `${uniqueText}After`;
        render(
          <DropdownItem
            elemBefore={<CheckIcon label={beforeText} />}
            elemAfter={<CheckIcon label={afterText} />}
            testId={testId}
          >
            Menu
          </DropdownItem>,
        );
        const iconBefore = screen.getByLabelText(beforeText);
        const iconBeforeContainer = screen.getByTestId(
          `${testId}--primitive--icon-before`,
        );
        const iconAfter = screen.getByLabelText(afterText);
        const iconAfterContainer = screen.getByTestId(
          `${testId}--primitive--icon-after`,
        );
        expect(iconBefore).toBeInTheDocument();
        expect(iconAfter).toBeInTheDocument();
        expect(iconBeforeContainer).toBeInTheDocument();
        expect(iconAfterContainer).toBeInTheDocument();
      });
    });
  });

  describe('link menu', () => {
    const href = '/hello';

    it('menu can be a link', () => {
      render(<DropdownItem href={href}>Menu</DropdownItem>);
      const link = screen.getByRole('menuitem');
      expect(link).toBeInTheDocument();
      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link).toHaveAttribute('href', href);
    });

    it('link menu should have description', () => {
      const desc = 'A long text to describe a menu';
      render(
        <DropdownItem href={href} description={desc}>
          Menu
        </DropdownItem>,
      );
      const link = screen.getByRole('menuitem');
      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link).toHaveAttribute('href', href);
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });
});
