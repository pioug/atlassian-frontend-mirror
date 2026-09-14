import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

import multilineParagraph from '../../__fixtures__/multiline-paragraphadf.json';

export const ChromelessEditor = (): React.JSX.Element => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return (
		<ComposableEditor preset={preset} appearance="chromeless" defaultValue={multilineParagraph} />
	);
};
