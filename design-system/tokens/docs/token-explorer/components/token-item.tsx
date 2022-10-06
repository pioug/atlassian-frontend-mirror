/** @jsx jsx */

import { jsx } from '@emotion/react';

import { token } from '../../../src';
import type { TransformedTokenGrouped } from '../types';

import TokenDescription from './token-description';
import TokenRow from './token-row';

interface TokenItemProps {
  token?: TransformedTokenGrouped;
  isLoading?: boolean;
  testId?: string;
}

const TokenItem = ({
  token: transformedToken,
  isLoading,
  testId,
}: TokenItemProps) => {
  if (!transformedToken) {
    return null;
  }

  return (
    <tr
      css={{
        borderTop: `1px solid ${token('color.border', '#091E4224')}`,
      }}
      data-testid={testId && `${testId}-token-item`}
    >
      <td
        colSpan={3}
        css={{
          margin: 0,
          padding: '16px 0',
          '@media (max-width: 1080px)': {
            paddingTop: '24px',
          },
        }}
      >
        <table>
          <tbody css={{ border: 0 }}>
            <TokenRow
              testId={testId}
              transformedToken={transformedToken}
              isLoading={isLoading}
              showDescription={
                transformedToken.extensions === undefined ||
                transformedToken.extensions.length === 0
              }
            />
            {transformedToken.extensions?.map((extension) => (
              <TokenRow
                key={extension.nameClean}
                testId={testId}
                transformedToken={extension}
                isLoading={isLoading}
              />
            ))}
            {transformedToken.extensions !== undefined &&
              transformedToken.extensions.length >= 0 && (
                <tr>
                  <td css={{ margin: 0, padding: 0 }}>
                    <TokenDescription
                      transformedToken={transformedToken}
                      isLoading={isLoading}
                    />
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

export default TokenItem;
