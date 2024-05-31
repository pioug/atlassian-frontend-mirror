import React, { useEffect } from 'react';

import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { HelperMessage } from '@atlaskit/form';

export default function ({ errorMessage }: { field: FieldDefinition; errorMessage: string }) {
	useEffect(() => {
		// eslint-disable-next-line no-console
		console.error(errorMessage);
	}, [errorMessage]);

	return <HelperMessage>{errorMessage}</HelperMessage>;
}
