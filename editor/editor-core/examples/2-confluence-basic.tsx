import React from 'react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets/FullPageBase';
import { ExampleDevNavigation } from '@af/editor-examples-helpers/utils/ExampleDevNavigation';
import { useEditorExamplesUrlSearchParamsConfig } from '@af/editor-examples-helpers/utils/examplesUrlHelpers';

export const Example = (): React.JSX.Element => {
	const [exampleProps] = useEditorExamplesUrlSearchParamsConfig();

	return (
		<React.Fragment>
			<ExampleDevNavigation />
			<FullPageBase {...exampleProps} />
		</React.Fragment>
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default Example;
