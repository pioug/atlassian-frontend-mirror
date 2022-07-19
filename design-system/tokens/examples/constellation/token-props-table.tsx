// import React from 'react';
/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { N20, N300, N500, N800, R500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import token from '../../src/get-token';

const containerStyles = css({
  borderRadius: `${gridSize()}px`,
  margin: `${gridSize() * 4}px -${gridSize() * 2}px 0`,
  padding: `${gridSize()}px ${gridSize() * 2}px`,

  'h3 + &': {
    marginTop: '0px',
  },
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',

  th: {
    textAlign: 'left',
    padding: `${gridSize() / 2}px ${gridSize() * 2}px ${
      gridSize() / 2
    }px ${gridSize()}px`,
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
  },

  td: {
    padding: `${gridSize() / 2}px 0 ${gridSize() / 2}px ${gridSize()}px`,
    width: '100%',
  },

  tbody: {
    borderBottom: 'none',
  },
});

const headerStyles = css({
  borderBottom: `1px solid ${token('color.border', '#EBECF0')}`,
  fontSize: '1em',
  fontWeight: 'normal',
  lineHeight: '1.4',
  margin: `0 0 ${gridSize() / 2}px 0`,
  paddingBottom: `${gridSize()}px`,
});

const codeStyles = css({
  backgroundColor: `${token('color.background.neutral', N20)}`,
  borderRadius: '3px',
  color: `${token('color.text', N800)}`,
  display: 'inline-block',
  fontSize: '1em',
  lineHeight: '20px',
  padding: '4px 8px',
});

const TokenPropsTable = ({
  propName,
  description,
  typing,
  required,
  defaultValue,
  deprecated,
}: {
  propName: string;
  description: string;
  typing: string;
  required?: boolean;
  defaultValue?: any;
  deprecated?: boolean;
}) => {
  return (
    <div css={containerStyles}>
      <table css={tableStyles}>
        <caption css={{ textAlign: 'left', margin: '0', fontSize: '1em' }}>
          <h3 css={headerStyles}>
            <code css={codeStyles}>{propName}</code>
            {required && defaultValue === undefined && (
              <code
                css={{
                  marginLeft: '1em',
                  color: `${token('color.text.danger', R500)}`,
                }}
              >
                required
              </code>
            )}
            {deprecated && (
              <code
                css={{
                  marginLeft: '1em',
                  color: `${token('color.text.disabled', N500)}`,
                }}
              >
                deprecated
              </code>
            )}
          </h3>
        </caption>
        <tbody>
          <tr>
            <th scope="row">Description</th>
            <td>{description}</td>
          </tr>
          {defaultValue !== undefined && (
            <tr>
              <th scope="row">Default</th>
              <td>
                <code
                  css={{
                    color: `${token('color.text.subtle', N300)}`,
                  }}
                >
                  {defaultValue}
                </code>
              </td>
            </tr>
          )}
          <tr>
            <th>Type</th>
            <td css={{ display: 'flex', flexDirection: 'column' }}>
              <span>
                <code
                  css={{
                    background: `${token('color.background.neutral', N20)}`,
                    color: `${token('color.text.subtle', N300)}`,
                    borderRadius: '3px',
                    display: 'inline-block',
                    padding: '0 0.2em',
                  }}
                >
                  {typing}
                </code>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TokenPropsTable;
