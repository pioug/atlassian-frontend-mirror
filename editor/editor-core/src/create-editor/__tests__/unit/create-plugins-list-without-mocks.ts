import type { EditorProps } from '../../../types';
import createPluginsListBase from '../../create-plugins-list';
import { createUniversalPreset } from '../../create-universal-preset';

jest.mock('@atlaskit/editor-plugins/expand');

const createPluginsList = (props: EditorProps, prevProps?: EditorProps) => {
	return createPluginsListBase(createUniversalPreset({ props, prevProps }), props);
};

describe('create-plugins-list without mock tests', () => {
	it('should have the default create-plugins-list plugins available for full-page', () => {
		// NOTE: This test is to ensure there aren't unsuspecting changes in the default plugins
		// However if you add a plugin, update the list here.
		const plugins = createPluginsList({ appearance: 'full-page' });

		const defaultPluginNames = [
			'paste',
			'clipboard',
			'base',
			'blockType',
			'placeholder',
			'clearMarksOnEmptyDoc',
			'hyperlink',
			'textFormatting',
			'width',
			'quickInsert',
			'typeAhead',
			'unsupportedContent',
			'editorDisabled',
			'submitEditor',
			'floatingToolbar',
			'selection',
			'codeBlock',
			'dataConsumer',
			'list',
			'contextPanel',
			'scrollIntoView',
			'toolbarListsIndentation',
			'insertBlock',
		];
		expect(plugins).toEqual(
			expect.arrayContaining(defaultPluginNames.map((name) => expect.objectContaining({ name }))),
		);
		expect(plugins.length).toBeGreaterThanOrEqual(defaultPluginNames.length);
	});

	describe('codeBlock', () => {
		it('should have code block plugin by default', () => {
			const plugins = createPluginsList({
				appearance: 'full-page',
			});
			expect(plugins).toEqual(
				expect.arrayContaining([expect.objectContaining({ name: 'codeBlock' })]),
			);
		});

		it('should not have the code block plugin if it is excluded', () => {
			const plugins = createPluginsList({
				appearance: 'full-page',
				allowBlockType: { exclude: ['codeBlock'] },
			});
			expect(plugins).not.toEqual(
				expect.arrayContaining([expect.objectContaining({ name: 'codeBlock' })]),
			);
		});
	});
});
