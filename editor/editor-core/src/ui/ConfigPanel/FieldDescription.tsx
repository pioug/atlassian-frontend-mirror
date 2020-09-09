import React from 'react';

import { HelperMessage } from '@atlaskit/form';

const FieldDescription = function ({
  error,
  description,
}: {
  error?: string;
  description?: string;
}) {
  if (error || !description) {
    return null;
  }

  return <HelperMessage>{description}</HelperMessage>;
};

export default FieldDescription;
