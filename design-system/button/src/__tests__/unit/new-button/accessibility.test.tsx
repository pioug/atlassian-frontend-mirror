import React, { ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import ButtonGroup from '../../../containers/button-group';
import { SplitButton } from '../../../new-button/containers/split-button';
import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';
import variants from '../../../utils/variants';

variants.forEach(({ name, Component, appearances }) =>
  appearances.map((appearance) => {
    describe(`${name}: '${appearance}' appearance accessibility`, () => {
      it('should not fail an aXe audit', async () => {
        const { container } = render(
          <Component
            // @ts-ignore
            appearance={appearance}
          >
            Save
          </Component>,
        );
        await axe(container);
      });

      it('should not fail an aXe audit when disabled', async () => {
        const { container } = render(
          <Component
            isDisabled
            // @ts-ignore
            appearance={appearance}
          >
            Save
          </Component>,
        );
        await axe(container);
      });

      it('should not fail an aXe audit when selected', async () => {
        const { container } = render(
          <Component
            isSelected
            // @ts-ignore
            appearance={appearance}
          >
            Save
          </Component>,
        );
        await axe(container);
      });

      it('should not fail an aXe audit with overlay', async () => {
        const { container } = render(
          <Component
            overlay="Hello"
            // @ts-ignore
            appearance={appearance}
          >
            Save
          </Component>,
        );
        await axe(container);
      });
    });
  }),
);

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
  ];

  appearances.forEach((appearance) => {
    it(`should not fail an aXe audit with ${appearance} appearance`, async () => {
      const view = render(
        <SplitButton appearance={appearance}>
          <Button>Primary action</Button>
          <IconButton
            onClick={jest.fn()}
            icon={SettingsIcon}
            label="Secondary action"
            UNSAFE_size="small"
          />
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
          icon={SettingsIcon}
          label="Secondary action"
          UNSAFE_size="small"
        />
      </SplitButton>,
    );

    await axe(view.container);
  });
});

describe('IconButton: Accessibility', () => {
  const appearances: ComponentProps<typeof IconButton>['appearance'][] = [
    'default',
    'primary',
    'subtle',
  ];

  appearances.forEach((appearance) => {
    it(`should not fail an aXe audit with ${appearance} appearance`, async () => {
      const view = render(
        <IconButton
          appearance={appearance}
          icon={SettingsIcon}
          label="Settings"
        />,
      );

      await axe(view.container);
    });
  });

  it('should not fail an aXe audit when disabled', async () => {
    const view = render(
      <IconButton isDisabled icon={SettingsIcon} label="Settings" />,
    );

    await axe(view.container);
  });
});
