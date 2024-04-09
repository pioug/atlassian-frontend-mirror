import React, { useState } from 'react';

import capitalize from 'lodash/capitalize';

import Checkbox from '@atlaskit/checkbox';
import { Stack } from '@atlaskit/primitives';

import variants from '../src/utils/variants';

export default function OverlayExample() {
  const [overlay, setOverlay] = useState(true);

  const overlayElement = (
    <span role="img" aria-label="Crazy face Emoji">
      🤪
    </span>
  );

  return (
    <Stack space="space.100" alignInline="start">
      <Checkbox
        label="Show overlay"
        isChecked={overlay}
        onChange={() => setOverlay((value) => !value)}
      />
      <table>
        <thead>
          <tr>
            <th>Variant</th>
            <th>Default</th>
            <th>Selected</th>
            <th>Disabled</th>
            <th>Selected + Disabled</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(({ name, Component }) => (
            <tr key={name}>
              <th>{capitalize(name)}</th>
              <td>
                <Component
                  key={name}
                  overlay={overlay ? overlayElement : undefined}
                >
                  Button
                </Component>
              </td>
              <td>
                <Component
                  key={name}
                  overlay={overlay ? overlayElement : undefined}
                  isSelected
                >
                  Button
                </Component>
              </td>
              <td>
                <Component
                  key={name}
                  overlay={overlay ? overlayElement : undefined}
                  isDisabled
                >
                  Button
                </Component>
              </td>
              <td>
                <Component
                  key={name}
                  overlay={overlay ? overlayElement : undefined}
                  isDisabled
                  isSelected
                >
                  Button
                </Component>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  );
}
