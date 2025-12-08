import React from 'react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets';
import {
	ExampleDevNavigation,
	useEditorExamplesUrlSearchParamsConfig,
} from '@af/editor-examples-helpers/utils';

export const Example = (): React.JSX.Element => {
	const [exampleProps] = useEditorExamplesUrlSearchParamsConfig();

	return (
		<React.Fragment>
			<ExampleDevNavigation />
			<FullPageBase {...exampleProps} />
		</React.Fragment>
	);
};

export default Example;
