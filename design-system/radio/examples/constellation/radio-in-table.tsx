/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { SyntheticEvent, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import { B50 } from '@atlaskit/theme/colors';

import { Radio } from '../../src';

interface RadioOptions {
  id: number;
  value: string;
  name: string;
  description: string;
  commit: string;
  updated: string;
}

const items: Array<RadioOptions> = [
  {
    id: 1,
    value: '1',
    name: 'branch',
    description: 'master',
    commit: 'dcc0f15',
    updated: '14 minutes ago',
  },
  {
    id: 2,
    value: '2',
    name: 'branch',
    description: 'feature/dark-mode',
    commit: 'cbc0fa3',
    updated: '56 minutes ago',
  },
  {
    id: 3,
    value: '3',
    name: 'branch',
    description: 'feature/right-to-left',
    commit: '69568ea',
    updated: '16 hours ago',
  },
  {
    id: 4,
    value: '4',
    name: 'branch',
    description: 'bug/type-incorrect-for-checked-prop',
    commit: '1159c76',
    updated: 'yesterday',
  },
];

const tableStyles = css({
  margin: '1em 0',
  padding: '0.5em',
  borderColor: '#ccc',
  borderStyle: 'dashed',
  borderWidth: '1px',
  color: '#ccc',
});

export default function RadioInputExample() {
  const [value, setValue] = useState<string>('1');

  const onChange = useCallback(
    ({ currentTarget: { value } }: SyntheticEvent<any>) => {
      setValue(value);
    },
    [setValue],
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ width: 0 }} />
            <th id="head-description">Branch</th>
            <th id="head-commit">Last commit</th>
            <th id="head-updated">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              onClick={() => setValue(item.value)}
              key={`${item.value}${item.name}${item.id}`}
              style={{
                backgroundColor: item.value === value ? B50 : 'transparent',
                transition: 'background-color 200ms ease-in-out',
              }}
            >
              <td style={{ width: 24, paddingRight: 0 }}>
                <Radio
                  isChecked={item.value === value}
                  onChange={onChange}
                  name={item.name}
                  value={item.value}
                  aria-labelledby={`head-description row-${item.id}-description head-commit row-${item.id}-commit head-updated row-${item.id}-updated`}
                />
              </td>
              <td id={`row-${item.id}-description`}>{item.description}</td>
              <td id={`row-${item.id}-commit`}>{item.commit}</td>
              <td id={`row-${item.id}-updated`}>{item.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div css={tableStyles}>currently selected value: {value}</div>
    </div>
  );
}
