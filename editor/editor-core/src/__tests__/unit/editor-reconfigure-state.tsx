import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorPlugin } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import Editor from '../../editor';

describe('reconfigure state', () => {
	let reconfigureSpy: jest.SpyInstance<EditorState, [props: any]>;

	beforeEach(() => {
		reconfigureSpy = jest.spyOn(EditorState.prototype, 'reconfigure');
	});

	afterEach(() => {
		reconfigureSpy.mockRestore();
	});

	it('should not reconfigure when updating the collab edit provider', () => {
		const collabEditProvider = jest.fn() as any;
		const setProviderSpy = jest.spyOn(ProviderFactory.prototype, 'setProvider');
		const { rerender, unmount } = renderWithIntl(<Editor collabEditProvider={undefined} />);
		rerender(<Editor collabEditProvider={collabEditProvider} />);
		expect(reconfigureSpy).toHaveBeenCalledTimes(0);
		expect(setProviderSpy).toHaveBeenCalledWith('collabEditProvider', collabEditProvider);

		unmount();
	});

	it('should reconfigure when updating the appearance', () => {
		const { rerender, unmount } = renderWithIntl(<Editor appearance="full-width" />);
		expect(reconfigureSpy).toHaveBeenCalledTimes(0);
		rerender(<Editor appearance="full-page" />);
		expect(reconfigureSpy).toHaveBeenCalledTimes(1);
		unmount();
	});

	it('should reconfigure the editor state when updating the dangerouslyAppendPlugins', () => {
		const { rerender, unmount } = renderWithIntl(<Editor />);
		expect(reconfigureSpy).toHaveBeenCalledTimes(0);
		rerender(
			<Editor
				dangerouslyAppendPlugins={{
					__plugins: [testPlugin],
				}}
			/>,
		);
		expect(reconfigureSpy).toHaveBeenCalledTimes(1);
		unmount();
	});
});

const testPlugin: EditorPlugin = {
	name: 'testPlugin',

	pmPlugins() {
		return [
			{
				name: 'testPlugin',
				plugin: () => new SafePlugin({}),
			},
		];
	},
};
