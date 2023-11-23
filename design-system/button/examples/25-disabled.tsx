import React, { useEffect, useRef, useState } from 'react';

import capitalize from 'lodash/capitalize';

import Checkbox from '@atlaskit/checkbox';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Stack } from '@atlaskit/primitives';

import variants from '../src/utils/variants';

export default function DisabledExample() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledTimer, setIsDisabledTimer] = useState(false);
  const disabledTimerInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isDisabledTimer) {
      disabledTimerInterval.current = setInterval(() => {
        setIsDisabled((value) => !value);
      }, 4000);
    } else if (disabledTimerInterval.current) {
      clearInterval(disabledTimerInterval.current);
    }
  }, [isDisabledTimer, setIsDisabled]);

  return (
    <Stack space="space.100" alignInline="start">
      <Checkbox
        label="Disable buttons"
        isChecked={isDisabled}
        onChange={() => setIsDisabled((value) => !value)}
      />
      {/* For testing mutation of the currently focused element - https://allyjs.io/tutorials/mutating-active-element.html */}
      <Checkbox
        label="Auto disable buttons"
        isChecked={isDisabledTimer}
        onChange={() => setIsDisabledTimer((value) => !value)}
      />
      {variants.map(({ name, Component, appearances }) => (
        <Stack space="space.150" key={name}>
          <h2>{name}</h2>
          <table>
            <thead>
              <tr>
                <th>Appearance</th>
                <th>Default</th>
                <th>Icon after</th>
                <th>Selected</th>
              </tr>
            </thead>
            <tbody>
              {appearances.map((appearance) => (
                <tr key={appearance}>
                  <th>{capitalize(appearance)}</th>
                  <td>
                    <Component
                      // @ts-ignore
                      appearance={appearance}
                      isDisabled={isDisabled}
                      onClick={() => {
                        console.log('click');
                      }}
                    >
                      Default
                    </Component>
                  </td>
                  <td>
                    <Component
                      // @ts-ignore
                      appearance={appearance}
                      iconAfter={ChevronDownIcon}
                      isDisabled={isDisabled}
                    >
                      Icon after
                    </Component>
                  </td>
                  <td>
                    <Component
                      // @ts-ignore
                      appearance={appearance}
                      isDisabled={isDisabled}
                      isSelected
                    >
                      Selected
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
