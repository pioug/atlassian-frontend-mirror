import React from 'react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets';
import {
	ExampleDevNavigation,
	useEditorExamplesUrlSearchParamsConfigListener,
} from '@af/editor-examples-helpers/utils';
import { Stack } from '@atlaskit/primitives';

export const Example = () => {
	const exampleProps = useEditorExamplesUrlSearchParamsConfigListener();

	return (
		<Stack space="space.100">
			<ExampleDevNavigation />
			<FullPageBase {...exampleProps} />
		</Stack>
	);
};

export default Example;
