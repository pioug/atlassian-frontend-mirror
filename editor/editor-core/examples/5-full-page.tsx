/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { type JSX } from 'react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets/FullPageBase';
import type { ExampleProps } from '@af/editor-examples-helpers/example-presets/types';

export {
	type EditorAPI,
	ExampleEditor,
	ExampleEditorComponent,
	getAppearance,
	quickInsertProvider,
	SaveAndCancelButtons,
	saveChanges,
	LOCALSTORAGE_defaultTitleKey,
	LOCALSTORAGE_defaultDocKey,
	BROWSER_FREEZE_NORMAL_SEVERITY_THRESHOLD,
	PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
	PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
} from '@af/editor-examples-helpers/example-presets';

const FullPageExample = (props: ExampleProps): JSX.Element => {
	return <FullPageBase {...props} />;
};

export default FullPageExample;
