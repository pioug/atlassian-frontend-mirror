import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import * as FeatureFlagsPlugin from '@atlaskit/editor-plugins/feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { createUniversalPreset } from '../../create-universal-preset';
import ReactEditorView from '../../ReactEditorView';

jest.mock('@atlaskit/editor-plugins/feature-flags', () => ({
	...jest.requireActual('@atlaskit/editor-plugins/feature-flags'),
	featureFlagsPlugin: jest.fn(() => ({
		name: 'featureFlags',
		sharedState: {
			currentState: () => ({}),
		},
	})),
}));

describe('ReactEditorView/reconfigureState', () => {
	const defaultProps = {
		providerFactory: ProviderFactory.create({}),
		portalProviderAPI: {} as any,
		nodeViewPortalProviderAPI: {} as any,
		onEditorCreated: () => {},
		onEditorDestroyed: () => {},
	};
	const featureFlagsCurrentStateSpy = jest.spyOn(FeatureFlagsPlugin, 'featureFlagsPlugin');

	afterEach(jest.clearAllMocks);

	describe('when the component is created', () => {
		it('should send the feature flag', () => {
			const editorProps = {};

			renderWithIntl(
				<ReactEditorView
					{...defaultProps}
					editorProps={editorProps}
					preset={createUniversalPreset({ props: editorProps })}
				/>,
			);

			expect(featureFlagsCurrentStateSpy).toHaveBeenCalledTimes(1);
			expect(featureFlagsCurrentStateSpy).toHaveBeenCalledWith({
				config: expect.any(Object),
				api: expect.objectContaining({}),
			});
		});
	});
});
