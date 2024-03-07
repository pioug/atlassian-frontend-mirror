import React from 'react';

import capitalize from 'lodash/capitalize';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Stack } from '@atlaskit/primitives';

import variants from '../src/utils/variants';

export default function SpacingExample() {
  return (
    <Stack space="space.200">
      {variants.map(({ name, Component, spacing }) => (
        <Stack space="space.150" key={name}>
          <h2>{name}</h2>
          <table>
            <thead>
              <tr>
                <th>Spacing</th>
                <th>Default appearance</th>
                <th>Icon after</th>
                <th>Link appearance</th>
              </tr>
            </thead>
            <tbody>
              {spacing.map((s) => (
                <tr key={s}>
                  <th>{capitalize(s)}</th>
                  <td>
                    <Component
                      // @ts-ignore
                      spacing={s}
                    >
                      Default
                    </Component>
                  </td>
                  <td>
                    <Component
                      // @ts-ignore
                      spacing={s}
                      iconAfter={ChevronDownIcon}
                    >
                      Icon
                    </Component>
                  </td>
                  <td>
                    <Component
                      // @ts-ignore
                      spacing={s}
                      // @ts-ignore
                      appearance="link"
                    >
                      Link
                    </Component>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Stack>
      ))}
    </Stack>
  );
}
