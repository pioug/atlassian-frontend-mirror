import React from 'react';

import { render } from '@testing-library/react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import { DropdownItem } from '../../index';

describe('DropdownMenu Item', () => {
  describe('default menu - button', () => {
    it('simple menu item', () => {
      const { getByText } = render(<DropdownItem>Menu</DropdownItem>);
      expect(getByText('Menu')).toBeInTheDocument();
    });

    it('should have description', () => {
      const desc = 'A long text to describe a menu';
      const { getByText } = render(
        <DropdownItem description={desc}>Menu</DropdownItem>,
      );
      expect(getByText(desc)).toBeInTheDocument();
    });

    it('should have icon before the text', () => {
      const { container } = render(
        <DropdownItem elemBefore={<CheckIcon label="check" />}>
          Menu
        </DropdownItem>,
      );

      const iconBefore = container.querySelector('[aria-label="check"]');
      expect(iconBefore).toBeInTheDocument();
      expect(
        container.querySelector('[data-item-elem-before="true"]'),
      ).toBeInTheDocument();
    });

    it('should have icon after the text', () => {
      const { container } = render(
        <DropdownItem elemAfter={<CheckIcon label="check" />}>
          Menu
        </DropdownItem>,
      );
      const iconBefore = container.querySelector('[aria-label="check"]');

      expect(iconBefore).toBeInTheDocument();
      expect(
        container.querySelector('[data-item-elem-after="true"]'),
      ).toBeInTheDocument();
    });

    it('should have icon before and after the text', () => {
      const { container } = render(
        <DropdownItem
          elemBefore={<CheckIcon label="check" />}
          elemAfter={<CheckIcon label="check" />}
        >
          Menu
        </DropdownItem>,
      );
      const iconBefore = container.querySelector('[aria-label="check"]');

      expect(iconBefore).toBeInTheDocument();
      expect(
        container.querySelector('[data-item-elem-before="true"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-item-elem-after="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe('link menu', () => {
    it('menu can be a link', () => {
      const { container } = render(
        <DropdownItem href="/hello">Menu</DropdownItem>,
      );
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link?.getAttribute('href')).toEqual('/hello');
    });

    it('link menu should have description', () => {
      const desc = 'A long text to describe a menu';
      const { container, getByText } = render(
        <DropdownItem href="/hello" description={desc}>
          Menu
        </DropdownItem>,
      );
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link?.getAttribute('href')).toEqual('/hello');
      expect(getByText(desc)).toBeInTheDocument();
    });
  });
});
