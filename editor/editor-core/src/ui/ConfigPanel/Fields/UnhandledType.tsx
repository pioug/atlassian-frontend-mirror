import React, { useEffect } from 'react';

import { HelperMessage } from '@atlaskit/form';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export default function ({
  errorMessage,
}: {
  field: FieldDefinition;
  errorMessage: string;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(errorMessage);
  }, [errorMessage]);

  return <HelperMessage>{errorMessage}</HelperMessage>;
}
