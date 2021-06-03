import React, { SyntheticEvent, useCallback, useState } from 'react';

import { css } from '@emotion/core';

import { B50 } from '@atlaskit/theme/colors';

import { Radio } from '../src';

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
            <th>Branch</th>
            <th>Last commit</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              onClick={() => setValue(item.value)}
              key={`${item.value}${item.name}${item.id}`}
              css={css`
                background-color: ${item.value === value ? B50 : 'transparent'};
                transition: background-color 200ms ease-in-out;
              `}
            >
              <td style={{ width: 24, paddingRight: 0 }}>
                <Radio
                  isChecked={item.value === value}
                  onChange={onChange}
                  name={item.name}
                  value={item.value}
                />
              </td>
              <td>{item.description}</td>
              <td>{item.commit}</td>
              <td>{item.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        css={css`
          border-style: dashed;
          border-width: 1px;
          border-color: #ccc;
          padding: 0.5em;
          color: #ccc;
          margin: 1em 0;
        `}
      >
        currently selected value: {value}
      </div>
    </div>
  );
}
