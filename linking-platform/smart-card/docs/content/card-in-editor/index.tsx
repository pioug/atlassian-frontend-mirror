import { code } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`

### Editor (@atlaskit/editor-core)

Smart Links in the editor enable users to effortlessly insert links by either pasting a URL or using the [Link Picker](https://atlaskit.atlassian.com/packages/linking-platform/link-picker),
which automatically transforms them into rich, interactive component.

##### Integrate Smart Links with Editor

1. Add the required plugin to editor presets by either add the \`cardPlugin\` directly to your editor's preset configurations,
or use pre-defined universal preset, which already includes \`cardPlugin\`.
This plugin is essential for enabling Smart Links in the editor. Use default or configure via \`linking\` options.

2. Use the \`ComposableEditor\` and pass the configured preset to it. For more information on \`ComposableEditor\`, please see [editor-core](https://atlaskit.atlassian.com/packages/editor/editor-core)

3. Wrap the \`ComposableEditor\` inside \`SmartCardProvider\`.

The minimum with default configurations.

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { usePreset } from '@atlaskit/editor-core/use-preset';

function Editor() {
  const { preset } = usePreset((builder) => {
      return builder.add([cardPlugin, {}])
  });

  return (
      <SmartCardProvider>
      	<ComposableEditor preset={preset} />
      </SmartCardProvider>
  );
}
`}

With pre-defined universal preset and custom configurations.

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

function Editor() {
	const universalPreset = useUniversalPreset({
		props: {
			linking: {
				smartLinks: {
					allowBlockCards: true,
					allowEmbeds: true,
					allowResizing: true,
				},
			},
		}
	});

	return (
	    <SmartCardProvider>
	  		<ComposableEditor preset={universalPreset} />
		</SmartCardProvider>
	);
}
`}

##### Configure Smart Links in editor

Please refer to [CardOptions](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/editor-common/src/card/cardOptions.ts) for the available configurations.

### Renderer (@atlaskit/renderer)

The renderer is designed to display the Atlassian Document Format (ADF).
Smart Links can be rendered in various formats, including Inline, Card (block), or Embed appearances, as specified within the ADF.

##### Integrate Smart Links with renderer

Wrap the \`Renderer\` inside \`SmartCardProvider\`. For more information on \`Renderer\`, please see [renderer](https://atlaskit.atlassian.com/packages/editor/renderer).

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Renderer } from '@atlaskit/renderer';

<SmartCardProvider>
  <Renderer />
</SmartCardProvider>
`}

##### Configure Smart Links in renderer

Set \`smartLinks\` on \`Renderer\` component.
Please refer to [SmartLinksOptions](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/renderer/src/types/smartLinksOptions.ts) for the available configurations.

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Renderer } from '@atlaskit/renderer';

<SmartCardProvider>
  <Renderer smartLinks={{ ssr: true }} />
</SmartCardProvider>
`}

### Related packages

* [@atlaskit/editor-core](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/editor-core)
* [@atlaskit/editor-plugin-card](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/editor-plugin-card)
* [@atlaskit/editor-plugin-hyperlink](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/editor-plugin-hyperlink)
* [@atlaskit/editor-card-provider](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/linking-platform/editor-card-provider)
* [@atlaskit/renderer](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/editor/renderer)

`;
