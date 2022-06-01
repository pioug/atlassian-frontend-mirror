/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';

import { getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenExtended } from '../grouped-tokens';

import CopyButton from './copy-button';
import Highlight from './highlight';

const tokenItemNameStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const tokenItemNameButtonStyles = css({
  marginRight: 10,
});

enum LozengeAppearance {
  deprecated = 'moved',
  deleted = 'removed',
}
interface TokenItemNameProps
  extends Pick<TransformedTokenExtended, 'name' | 'attributes'> {
  className?: string;
  searchQuery?: string;
}

const TokenItemName = ({
  name,
  attributes,
  className,
  searchQuery,
}: TokenItemNameProps) => {
  const cleanName = getTokenId(name);

  return (
    <div css={tokenItemNameStyles} className={className}>
      <CopyButton copyValue={cleanName} css={tokenItemNameButtonStyles}>
        <Highlight highlight={searchQuery}>{cleanName}</Highlight>
      </CopyButton>
      {attributes.state !== 'active' && (
        <Lozenge appearance={LozengeAppearance[attributes.state]}>
          {attributes.state}
        </Lozenge>
      )}
    </div>
  );
};

export default TokenItemName;
