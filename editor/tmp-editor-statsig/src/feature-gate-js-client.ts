import FeatureGates from '@atlaskit/feature-gate-js-client';

export type EditorFeatureGateKeys = 'editor_inline_comments_on_inline_nodes';

const EditorFeatureGates = {
	checkGate: (key: EditorFeatureGateKeys): boolean => {
		return FeatureGates.checkGate(key);
	},
	/**
	 *
	 * Warning -- this is not yet implemented
	 *
	 * When implemented -- please update docs/0-intro.tsx
	 */
	getExperimentValue: (() => {}) as never,
};

export default EditorFeatureGates;
