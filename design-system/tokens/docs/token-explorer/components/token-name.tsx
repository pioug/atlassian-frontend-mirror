/** @jsx jsx */
import { useContext, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';

import { getCSSCustomProperty, getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenMerged } from '../types';

import TokenButton from './token-button';
import { Label } from './token-button-variants';
import { TokenNameSyntaxContext } from './token-name-syntax-context';

enum LozengeAppearance {
  deprecated = 'moved',
  deleted = 'removed',
  experimental = 'new',
}

interface TokenNameProps
  extends Pick<TransformedTokenMerged, 'name' | 'attributes'> {
  className?: string;
}

const TokenName = ({ name, attributes, className }: TokenNameProps) => {
  const { syntax } = useContext(TokenNameSyntaxContext);

  const formattedName = useMemo(() => {
    if (syntax === 'css-var') {
      return getCSSCustomProperty(name);
    }
    return getTokenId(name);
  }, [name, syntax]);

  return (
    <div css={tokenNameStyles} className={className}>
      <TokenButton copyValue={formattedName}>
        <Label appearance="subtle">{formattedName}</Label>
      </TokenButton>
      {attributes.state !== 'active' && (
        <Lozenge appearance={LozengeAppearance[attributes.state]}>
          {attributes.state}
        </Lozenge>
      )}
    </div>
  );
};

const tokenNameStyles = css({
  display: 'flex',
  alignItems: 'center',
});

export default TokenName;
