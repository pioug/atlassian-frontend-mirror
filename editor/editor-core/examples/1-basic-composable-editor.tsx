import React from 'react';

import { code } from '@atlaskit/docs';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';

function Editor() {
	const { preset } = usePreset((builder) =>
		builder.add(basePlugin).add([analyticsPlugin, {}]).add(blockTypePlugin).add(listPlugin),
	);

	return <ComposableEditor preset={preset} />;
}

export default function Example() {
	return (
		<div>
			<p>
				{
					'A basic example of the Composable Editor which has basic text formatting, analytics, headings, and lists.'
				}
			</p>
			{code`import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';

function Editor() {
  const { preset } = usePreset(
    (builder) =>
      builder
        .add(basePlugin)
        .add(analyticsPlugin)
        .add(blockTypePlugin)
        .add(listPlugin),
    [],
  );

  return <ComposableEditor preset={preset} />;
}`}
			<br />
			<Editor />
		</div>
	);
}
