import React, { Fragment, useState } from 'react';

import capitalize from 'lodash/capitalize';

import Checkbox from '@atlaskit/checkbox';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import {
  type Appearance,
  type Spacing,
} from '../src/new-button/variants/types';
import OldButton from '../src/old-button/button';
import appearances from '../src/utils/appearances';
import spacing from '../src/utils/spacing';
import variants, { type Variant } from '../src/utils/variants';

const overlay = (
  <span role="img" aria-label="Smiley face">
    🙂
  </span>
);

const shouldFitContainerStyles = xcss({ width: 'size.1000' });
const longLabelStyles = xcss({ width: 'size.600' });

const ExampleRow = ({
  component: Component,
  appearance,
  spacing,
  type,
  showOldButton,
}: {
  appearance: Appearance;
  spacing: Spacing;
  component: Variant['Component'] | typeof OldButton;
  type: 'old' | 'new';
  showOldButton: boolean;
}) => (
  <tr>
    {showOldButton && <th>{capitalize(type)} button</th>}
    <td>
      <Component appearance={appearance} spacing={spacing}>
        {capitalize(appearance)}
      </Component>
    </td>
    <td>
      <Component
        appearance={appearance}
        iconBefore={<ChevronDownIcon label="" />}
        iconAfter={<ChevronDownIcon label="" />}
      >
        Button
      </Component>
    </td>
    <td>
      <Component appearance={appearance} isDisabled spacing={spacing}>
        Button
      </Component>
    </td>
    <td>
      <Component appearance={appearance} isSelected spacing={spacing}>
        Button
      </Component>
    </td>
    <td>
      <Component
        appearance={appearance}
        isSelected
        isDisabled
        spacing={spacing}
      >
        Button
      </Component>
    </td>
    <td>
      <Component appearance={appearance} overlay={overlay} spacing={spacing}>
        Button
      </Component>
    </td>
    <td>
      <Component
        appearance={appearance}
        overlay={overlay}
        isDisabled
        spacing={spacing}
      >
        Button
      </Component>
    </td>
    <td>
      <Component
        appearance={appearance}
        overlay={overlay}
        isSelected
        spacing={spacing}
      >
        Button
      </Component>
    </td>
    <td>
      <Component
        appearance={appearance}
        overlay={overlay}
        isSelected
        isDisabled
        spacing={spacing}
      >
        Button
      </Component>
    </td>
    <td>
      <Box xcss={shouldFitContainerStyles}>
        <Component appearance={appearance} shouldFitContainer spacing={spacing}>
          Button
        </Component>
      </Box>
    </td>
    <td>
      <Box xcss={longLabelStyles}>
        <Component appearance={appearance} spacing={spacing}>
          Button with long label
        </Component>
      </Box>
    </td>
  </tr>
);

export default function AppearancesExample() {
  const [showOldButton, setShowOldButton] = useState(false);

  const columnCount = showOldButton ? 11 : 10;

  return (
    <Box padding="space.200">
      <Checkbox
        label="Compare to old button"
        isChecked={showOldButton}
        onChange={() => setShowOldButton((value) => !value)}
      />
      <Stack space="space.200">
        {variants.map(({ name, Component: NewButtonComponent }) => (
          <Stack space="space.100" key={name}>
            <h2>{name}</h2>
            <table>
              <thead>
                <tr>
                  {showOldButton && <th>Version</th>}
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
                        {showOldButton && (
                          <ExampleRow
                            showOldButton={showOldButton}
                            appearance={appearance}
                            component={OldButton}
                            spacing={space}
                            type="old"
                          />
                        )}
                        <ExampleRow
                          showOldButton={showOldButton}
                          appearance={appearance}
                          component={NewButtonComponent}
                          spacing={space}
                          type="new"
                        />
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
