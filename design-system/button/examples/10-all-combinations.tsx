import React, { Fragment, useState } from 'react';

import capitalize from 'lodash/capitalize';

import Checkbox from '@atlaskit/checkbox';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { type Appearance, type Spacing } from '../src/new';
import LegacyButton from '../src/old-button/button';
import spacing from '../src/utils/spacing';
import variants, { type Variant } from '../src/utils/variants';

const overlay = (
  <span role="img" aria-label="Smiley face">
    🙂
  </span>
);

const shouldFitContainerStyles = xcss({ width: 'size.1000' });
const longLabelStyles = xcss({ width: 'size.600' });

type ComponentVersion =
  | {
      component: Variant['Component'];
      version: 'new';
    }
  | {
      component: typeof LegacyButton;
      version: 'legacy';
    };

const ExampleRow = ({
  component: Component,
  appearance,
  spacing,
  version,
  isIconOnly,
  showLegacyButton,
}: {
  appearance: Appearance;
  spacing: Spacing;
  showLegacyButton: boolean;
  isIconOnly: boolean;
} & ComponentVersion) => {
  const isLegacyIconButton = isIconOnly && version === 'legacy';

  return (
    <tr>
      {showLegacyButton && <th>{capitalize(version)} button</th>}
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          spacing={spacing}
        >
          {isLegacyIconButton ? null : capitalize(appearance)}
        </Component>
      </td>
      <td>
        {isIconOnly ? (
          'N/A '
        ) : (
          <Component
            // @ts-ignore
            appearance={appearance}
            spacing={spacing}
            // @ts-ignore
            iconBefore={
              version === 'legacy' ? (
                <ChevronDownIcon label="" />
              ) : (
                ChevronDownIcon
              )
            }
            // @ts-ignore
            iconAfter={
              version === 'legacy' ? (
                <ChevronDownIcon label="" />
              ) : (
                ChevronDownIcon
              )
            }
          >
            {isIconOnly ? null : 'Hello'}
          </Component>
        )}
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          isDisabled
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          isSelected
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          isSelected
          isDisabled
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          overlay={overlay}
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          overlay={overlay}
          isDisabled
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          overlay={overlay}
          isSelected
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Component
          // @ts-ignore
          appearance={appearance}
          overlay={overlay}
          isSelected
          isDisabled
          spacing={spacing}
        >
          {isIconOnly ? null : 'Hello'}
        </Component>
      </td>
      <td>
        <Box xcss={shouldFitContainerStyles}>
          <Component
            // @ts-ignore
            appearance={appearance}
            shouldFitContainer
            spacing={spacing}
          >
            {isIconOnly ? null : 'Hello'}
          </Component>
        </Box>
      </td>
      <td>
        {isIconOnly ? (
          'N/A '
        ) : (
          <Box xcss={longLabelStyles}>
            <Component
              // @ts-ignore
              appearance={appearance}
              spacing={spacing}
            >
              {isIconOnly ? null : 'I have a long label'}
            </Component>
          </Box>
        )}
      </td>
    </tr>
  );
};

export default function AppearancesExample() {
  const [showLegacyButton, setShowLegacyButton] = useState(false);

  const columnCount = showLegacyButton ? 11 : 10;

  return (
    <Box padding="space.200">
      <Checkbox
        label="Compare to legacy button"
        isChecked={showLegacyButton}
        onChange={() => setShowLegacyButton((value) => !value)}
      />
      <Stack space="space.200">
        {variants.map(
          ({ name, Component: NewButtonComponent, appearances }) => {
            const isIconOnly = ['IconButton', 'LinkIconButton'].includes(name);
            return (
              <Stack space="space.100" key={name}>
                <h2>{name}</h2>
                <table>
                  <thead>
                    <tr>
                      {showLegacyButton && <th>Version</th>}
                      <th>Default</th>
                      <th>Icons</th>
                      <th>Disabled</th>
                      <th>Selected</th>
                      <th>Disabled + Selected</th>
                      <th>Overlay</th>
                      <th>Disabled + Overlay</th>
                      <th>Selected + Overlay</th>
                      <th>Disabled + Overlay + Selected</th>
                      <th>Should fit container</th>
                      <th>Truncation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spacing.map((space) => (
                      <Fragment key={space}>
                        <tr>
                          <th colSpan={columnCount}>
                            <Box paddingBlock="space.150">
                              <h3>{capitalize(space)} spacing</h3>
                            </Box>
                          </th>
                        </tr>
                        {appearances.map((appearance) => (
                          <Fragment key={appearance}>
                            {showLegacyButton && (
                              <ExampleRow
                                showLegacyButton={showLegacyButton}
                                appearance={appearance}
                                component={LegacyButton}
                                spacing={space}
                                version="legacy"
                                isIconOnly={isIconOnly}
                              />
                            )}
                            <ExampleRow
                              showLegacyButton={showLegacyButton}
                              appearance={appearance}
                              component={NewButtonComponent}
                              spacing={space}
                              version="new"
                              isIconOnly={isIconOnly}
                            />
                          </Fragment>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </Stack>
            );
          },
        )}
      </Stack>
    </Box>
  );
}
