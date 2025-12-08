import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

export const EmptyFullPageEditor = (): React.JSX.Element => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return <ComposableEditor preset={preset} appearance="full-page" />;
};
