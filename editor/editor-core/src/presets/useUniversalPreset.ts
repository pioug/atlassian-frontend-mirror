import { useLayoutEffect, useState } from 'react';

import { usePreviousState } from '@atlaskit/editor-common/hooks';

import { createUniversalPreset } from '../create-editor/create-universal-preset';
import { shouldRecreatePreset } from '../create-editor/preset-utils';
import type { EditorProps } from '../types/editor-props';

import { type InitialPluginConfiguration } from './universal';

interface PresetProps {
	props: EditorProps;
	initialPluginConfiguration?: InitialPluginConfiguration;
}

export default function useUniversalPreset({ props, initialPluginConfiguration }: PresetProps) {
	const previousEditorProps = usePreviousState(props);
	const [preset, setPreset] = useState(() =>
		createUniversalPreset({ props, prevProps: previousEditorProps, initialPluginConfiguration }),
	);
	useLayoutEffect(() => {
		if (!previousEditorProps) {
			return;
		}

		const recreate = shouldRecreatePreset(previousEditorProps, props);

		if (!recreate) {
			return;
		}
		// we are not comparing the previous initialPluginConfiguration to the new one assuming that it never changes
		setPreset(
			createUniversalPreset({ props, prevProps: previousEditorProps, initialPluginConfiguration }),
		);
	}, [props, previousEditorProps, initialPluginConfiguration]);
	return preset;
}
