/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';
import { gridSize } from '@atlaskit/theme/constants';

import { getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenMerged } from '../types';

import TokenButton from './token-button';
import { Label } from './token-button-variants';

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
  const cleanName = getTokenId(name);

  return (
    <div css={tokenItemNameStyles} className={className}>
      <TokenButton copyValue={cleanName} css={tokenItemNameButtonStyles}>
        <Label appearance="subtle">{cleanName}</Label>
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
