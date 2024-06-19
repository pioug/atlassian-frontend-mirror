import { code, md } from '@atlaskit/docs';

export default md`

Temp plugin to ease use of statsig feature flags until platform feature flags are available

**Warning:** This is a temporary solution and will be removed once platform feature flags are able to be used with statsig.

**Warning:** This is not yet compatible with experiments (please add as needed).

## Usage

### EditorFeatureGates

  ${code`

import EditorFeatureGates from '@atlaskit/editor-statsig-tmp/feature-gate-js-client';

if (EditorFeatureGates.checkGate('platform_editor_inline_comments_on_inline_nodes')) {
	// do something
}
	`}

### EditorFeatureGatesInitialization

This is a thin wrapper on FeatureGatesInitialization from "@atlassian/feature-gates-react" to
simplify the use of feature flags in the editor examples (and ensure type safety).

${code`
import { EditorFeatureGatesInitialization } from '@atlaskit/editor-statsig-tmp/feature-gates-react';

<EditorFeatureGatesInitialization
	overrides={{ gates: { platform_editor_inline_comments_on_inline_nodes: true } }}
>
	<YourExampleCode />
</EditorFeatureGatesInitialization>;
	`}

`;
