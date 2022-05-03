/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';
import { codeFontFamily } from '@atlaskit/theme/constants';

import { getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenExtended } from '../grouped-tokens';

import CopyButton from './copy-button';

const tokenItemNameStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const tokenItemNameButtonStyles = css({
  fontFamily: codeFontFamily(),
  fontSize: 12,
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

  const parts = searchQuery
    ? cleanName.split(
        new RegExp(
          `(${searchQuery.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&')})`,
          'gi',
        ),
      )
    : undefined;

  const highlightedName = parts
    ? parts.map((part, i) =>
        part.toLowerCase() === searchQuery ? (
          <mark key={`${part}${i}`}>{part}</mark>
        ) : (
          part
        ),
      )
    : cleanName;

  return (
    <div css={tokenItemNameStyles} className={className}>
      <CopyButton copyValue={cleanName} css={tokenItemNameButtonStyles}>
        {highlightedName}
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
