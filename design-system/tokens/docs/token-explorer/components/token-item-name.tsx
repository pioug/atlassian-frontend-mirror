/** @jsx jsx */
import { useContext, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';
import { gridSize } from '@atlaskit/theme/constants';

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

interface TokenItemNameProps
  extends Pick<TransformedTokenMerged, 'name' | 'attributes'> {
  className?: string;
}

const TokenItemName = ({ name, attributes, className }: TokenItemNameProps) => {
  const { syntax } = useContext(TokenNameSyntaxContext);

  const formattedName = useMemo(() => {
    if (syntax === 'css-var') {
      return getCSSCustomProperty(name);
    }
    return getTokenId(name);
  }, [name, syntax]);

  return (
    <div css={tokenItemNameStyles} className={className}>
      <TokenButton copyValue={formattedName} css={tokenItemNameButtonStyles}>
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

const tokenItemNameStyles = css({
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 1080px)': {
    marginBottom: gridSize() * 2,
  },
});

const tokenItemNameButtonStyles = css({
  marginRight: 10,
});

export default TokenItemName;
