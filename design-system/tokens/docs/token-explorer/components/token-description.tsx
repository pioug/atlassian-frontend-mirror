/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import { N200 } from '@atlaskit/theme/colors';

import { token } from '../../../src';
import { getTokenId } from '../../../src/utils/token-ids';
import { TransformedTokenGrouped } from '../types';

const TokenDescription: React.FC<{
  isLoading?: boolean;
  transformedToken?: TransformedTokenGrouped;
}> = (props) => {
  const { isLoading, transformedToken } = props;

  if (isLoading || !transformedToken) {
    return null;
  }

  return (
    <Fragment>
      <p css={{ margin: 0 }}>{transformedToken.attributes.description}</p>
      <p
        css={{
          color: token('color.text.subtlest', N200),
          fontSize: 12,
        }}
      >
        Introduced v{transformedToken.attributes.introduced}
        {'deprecated' in transformedToken.attributes &&
          ` → Deprecated v${transformedToken.attributes.deprecated}`}
        {'deleted' in transformedToken.attributes &&
          ` → Deleted v${transformedToken.attributes.deleted}`}
        {'replacement' in transformedToken.attributes &&
          `. Replace with ${
            Array.isArray(transformedToken.attributes.replacement)
              ? transformedToken.attributes.replacement.map(
                  (replacement, i) =>
                    `${getTokenId(replacement)}${i > 0 ? ' / ' : ' '}`,
                )
              : getTokenId(transformedToken.attributes.replacement)
          }`}
      </p>
    </Fragment>
  );
};

export default TokenDescription;
