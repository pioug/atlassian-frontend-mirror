/** @jsx jsx */
import { jsx } from '@emotion/react';

import { TransformedTokenGrouped } from '../types';

const TokenDescription: React.FC<{
  isLoading?: boolean;
  transformedToken?: TransformedTokenGrouped;
}> = (props) => {
  const { isLoading, transformedToken } = props;

  if (isLoading || !transformedToken) {
    return null;
  }

  return <p css={{ margin: 0 }}>{transformedToken.attributes.description}</p>;
};

export default TokenDescription;
