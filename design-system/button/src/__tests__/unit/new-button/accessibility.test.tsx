import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ButtonGroup from '../../../containers/button-group';
import Button from '../../../new-button/variants/default/button';
import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  describe(`${name}: Accessibility`, () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<Component>Save</Component>);
      await axe(container);
    });

    it('should not fail an aXe audit when disabled', async () => {
      const { container } = render(<Component isDisabled>Save</Component>);
      await axe(container);
    });

    it('should not fail an aXe audit when selected', async () => {
      const { container } = render(<Component isSelected>Save</Component>);
      await axe(container);
    });

    it('should not fail an aXe audit with overlay', async () => {
      const { container } = render(<Component overlay="Hello">Save</Component>);
      await axe(container);
    });
  });
});
describe('ButtonGroup: Accessibility', () => {
  it('should not fail an aXe audit', async () => {
    const screen = render(
      <ButtonGroup>
        <Button>Test button one</Button>
        <Button>Test button two</Button>
        <Button>Test button three</Button>
      </ButtonGroup>,
    );

    await axe(screen.container);
  });
});
