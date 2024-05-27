import React, { type ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import ButtonGroup from '../../../containers/button-group';
import { SplitButton } from '../../../new-button/containers/split-button';
import Button from '../../../new-button/variants/default/button';
import LinkButton from '../../../new-button/variants/default/link';
import IconButton from '../../../new-button/variants/icon/button';
import LinkIconButton from '../../../new-button/variants/icon/link';
import variants, { iconButtonVariants } from '../../../utils/variants';

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

      it('should not fail an aXe audit when loading', async () => {
        const { container } = render(
          <Component
            isLoading
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

describe('Icon button: Accessibility', () => {
  iconButtonVariants.forEach(({ name, Component }) => {
    const appearances: ComponentProps<typeof IconButton>['appearance'][] = [
      'default',
      'primary',
      'subtle',
    ];

    appearances.forEach((appearance) => {
      it(`${name}: should not fail an aXe audit with ${appearance} appearance`, async () => {
        const view = render(
          <Component
            appearance={appearance}
            icon={SettingsIcon}
            label="Settings"
          />,
        );

        await axe(view.container);
      });
    });

    const shapes: ComponentProps<typeof IconButton>['shape'][] = [
      'default',
      'circle',
    ];

    shapes.forEach((shape) => {
      it(`${name}: should not fail an aXe audit with ${shape} shape`, async () => {
        const view = render(
          <Component icon={SettingsIcon} label="Settings" shape={shape} />,
        );

        await axe(view.container);
      });
    });

    it(`${name}: should not fail an aXe audit when disabled`, async () => {
      const view = render(
        <Component isDisabled icon={SettingsIcon} label="Settings" />,
      );

      await axe(view.container);
    });

    it(`${name}: should not allow 'aria-label' to be passed in order to prevent duplicate labels`, async () => {
      render(
        // @ts-expect-error
        <Component
          testId="icon-button"
          aria-label="Settings"
          isDisabled
          icon={SettingsIcon}
          label="Settings"
        />,
      );

      const button = screen.getByTestId('icon-button');
      expect(button).not.toHaveAttribute('aria-label');
    });
  });
});

describe('Link button" Accessibility', () => {
  describe('"(opens new window)" announcements', () => {
    it('should be added to the accessible name if `target="_blank"`', () => {
      render(
        <LinkButton
          href="https://www.atlassian.com"
          testId="anchor"
          target="_blank"
        >
          Atlassian website
        </LinkButton>,
      );

      const anchor = screen.getByTestId('anchor');
      expect(anchor).toHaveAccessibleName(
        'Atlassian website (opens new window)',
      );
    });
    it('should not be added to the accessible name if `target` is not "_blank"', () => {
      render(
        <LinkButton
          href="https://www.atlassian.com"
          testId="anchor"
          target="_self"
        >
          Atlassian website
        </LinkButton>,
      );

      const anchor = screen.getByTestId('anchor');
      expect(anchor).toHaveAccessibleName('Atlassian website');
    });
  });
});

describe('Link icon button" Accessibility', () => {
  describe('"(opens new window)" announcements', () => {
    it('should be added to the accessible name if `target="_blank"`', () => {
      render(
        <LinkIconButton
          icon={SettingsIcon}
          label="Atlassian website"
          href="https://www.atlassian.com"
          testId="anchor"
          target="_blank"
        />,
      );

      const anchor = screen.getByTestId('anchor');
      expect(anchor).toHaveAccessibleName(
        'Atlassian website (opens new window)',
      );
    });
    it('should not be added to the accessible name if `target` is not "_blank"', () => {
      render(
        <LinkIconButton
          icon={SettingsIcon}
          label="Atlassian website"
          href="https://www.atlassian.com"
          testId="anchor"
          target="_self"
        />,
      );

      const anchor = screen.getByTestId('anchor');
      expect(anchor).toHaveAccessibleName('Atlassian website');
    });
  });
});
