import React, { ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import ButtonGroup from '../../../containers/button-group';
import { SplitButton } from '../../../new-button/containers/split-button';
import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';
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
    const view = render(
      <ButtonGroup>
        <Button>Test button one</Button>
        <Button>Test button two</Button>
        <Button>Test button three</Button>
      </ButtonGroup>,
    );

    await axe(view.container);
  });
});

describe('SplitButton: Accessibility', () => {
  const appearances: ComponentProps<typeof SplitButton>['appearance'][] = [
    'default',
    'primary',
    'warning',
    'danger',
  ];

  appearances.forEach((appearance) => {
    it(`should not fail an aXe audit with ${appearance} appearance`, async () => {
      const view = render(
        <SplitButton appearance={appearance}>
          <Button>Primary action</Button>
          <IconButton
            onClick={jest.fn()}
            icon={<SettingsIcon label="Secondary action" size="small" />}
          >
            Secondary action
          </IconButton>
        </SplitButton>,
      );

      await axe(view.container);
    });
  });

  it('should not fail an aXe audit when disabled', async () => {
    const view = render(
      <SplitButton isDisabled>
        <Button>Primary action</Button>
        <IconButton
          onClick={jest.fn()}
          icon={<SettingsIcon label="Secondary action" size="small" />}
        >
          Secondary action
        </IconButton>
      </SplitButton>,
    );

    await axe(view.container);
  });
});

describe('IconButton: Accessibility', () => {
  const appearances: ComponentProps<typeof IconButton>['appearance'][] = [
    'default',
    'primary',
    'warning',
    'danger',
    'subtle',
  ];

  appearances.forEach((appearance) => {
    it(`should not fail an aXe audit with ${appearance} appearance`, async () => {
      const view = render(
        <IconButton
          appearance={appearance}
          // NOTE: right now without a label on the icon we fail
          icon={<SettingsIcon label="Settings" />}
        >
          I am text that a user never sees (even in the accessibility tree) as
          this currently gets overwritten in the useIconButton hook, but
          currently we still require children. see
          https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43158
          for a fix
        </IconButton>,
      );

      await axe(view.container);
    });
  });

  it('should not fail an aXe audit when disabled', async () => {
    const view = render(
      // NOTE: right now without a label on the icon we fail
      <IconButton isDisabled icon={<SettingsIcon label="Settings" />}>
        I am text that a user never sees (even in the accessibility tree) as
        this currently gets overwritten in the useIconButton hook, but currently
        we still require children. see
        https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43158
        for a fix
      </IconButton>,
    );

    await axe(view.container);
  });
});
