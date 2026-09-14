import React from 'react';

import type { RegisterMenuSection } from '@atlaskit/editor-ui-control-model/types';

import { PassThrough } from './PassThrough';

export const TypeAheadSectionRow = ({
	registration,
}: {
	registration: RegisterMenuSection;
}): React.JSX.Element => {
	const Component = registration.component ?? PassThrough;

	return <Component>{null}</Component>;
};
