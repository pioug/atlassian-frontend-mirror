import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';

export default function Editor(): React.JSX.Element {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(typeAheadPlugin)
			.add(quickInsertPlugin)
			.add(tasksAndDecisionsPlugin),
	);

	return <ComposableEditor appearance="full-page" preset={preset} />;
}
