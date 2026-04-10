import type { DiffParams } from '@atlaskit/editor-plugin-show-diff';

interface Props {
	options: DiffParams | undefined;
}

export function showDiffPluginOptions({ options }: Props): DiffParams | undefined {
	if (!options?.originalDoc || !options?.steps) {
		return undefined;
	}

	return {
		originalDoc: options.originalDoc,
		steps: options.steps,
		colorScheme: options.colorScheme,
	};
}
