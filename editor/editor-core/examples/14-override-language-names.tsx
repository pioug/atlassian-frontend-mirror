import React from 'react';

import { code } from '@atlaskit/docs';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';

function Editor() {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add([analyticsPlugin, {}])
			.add(blockTypePlugin)
			.add(listPlugin)
			.add(copyButtonPlugin)
			.add(editorDisabledPlugin)
			.add(decorationsPlugin)
			.add(floatingToolbarPlugin)
			.add(compositionPlugin)
			.add([
				codeBlockPlugin,
				{
					overrideLanguageName: (name) => (name === 'Handlebars' ? 'Mustache' : name),
				},
			])
			.add(selectionPlugin)
			.add(codeBlockAdvancedPlugin),
	);

	return <ComposableEditor preset={preset} />;
}

export default function Example() {
	return (
		<div>
			<p>{'A basic example of overriding the label of a language options to a different name.'}</p>
			{code`
function Editor() {
  const { preset } = usePreset((builder) =>
    builder.add(basePlugin)
      .add([analyticsPlugin, {}])
      .add(blockTypePlugin)
      .add(listPlugin)
      .add(copyButtonPlugin)
      .add(editorDisabledPlugin)
      .add(decorationsPlugin)
      .add(floatingToolbarPlugin)
      .add(compositionPlugin)
      .add([codeBlockPlugin, {
        overrideLanguageName: name => name === 'Handlebars' ? 'Mustache' : name
      }]),
  );

  return <ComposableEditor preset={preset} />;
}`}
			<br />
			<Editor />
		</div>
	);
}
