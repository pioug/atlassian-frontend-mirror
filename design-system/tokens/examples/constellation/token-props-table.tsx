/** @jsx jsx */

import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import token from '../../src/get-token';

const containerStyles = css({
  margin: `${gridSize() * 4}px -${gridSize() * 2}px 0`,
  padding: `${gridSize()}px ${gridSize() * 2}px`,
  borderRadius: `${gridSize()}px`,
  'h3 + &': {
    marginBlockStart: '0px',
  },
});

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',

  th: {
    padding: `${gridSize() / 2}px ${gridSize() * 2}px ${
      gridSize() / 2
    }px ${gridSize()}px`,
    textAlign: 'left',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
  },

  td: {
    width: '100%',
    padding: `${gridSize() / 2}px 0 ${gridSize() / 2}px ${gridSize()}px`,
  },

  tbody: {
    borderBlockEnd: 'none',
  },
});

const headerStyles = css({
  margin: `0 0 ${gridSize() / 2}px 0`,
  borderBlockEnd: `1px solid ${token('color.border')}`,
  fontSize: '1em',
  fontWeight: 'normal',
  lineHeight: '1.4',
  paddingBlockEnd: `${gridSize()}px`,
});

const codeStyles = css({
  display: 'inline-block',
  backgroundColor: token('color.background.neutral'),
  borderRadius: token('border.radius.100', '3px'),
  color: `${token('color.text')}`,
  fontSize: '1em',
  lineHeight: '20px',
  paddingBlock: token('space.050', '4px'),
  paddingInline: token('space.100', '8px'),
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
                  color: `${token('color.text.danger')}`,
                }}
              >
                required
              </code>
            )}
            {deprecated && (
              <code
                css={{
                  marginLeft: '1em',
                  color: `${token('color.text.disabled')}`,
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
                    color: `${token('color.text.subtle')}`,
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
                    background: `${token('color.background.neutral')}`,
                    color: `${token('color.text.subtle')}`,
                    borderRadius: token('border.radius.100', '3px'),
                    display: 'inline-block',
                    padding: '0 0.2em',
                    whiteSpace: 'pre-wrap',
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
