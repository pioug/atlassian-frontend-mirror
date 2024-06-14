jest.mock('@atlaskit/editor-plugins/hyperlink');
jest.mock('@atlaskit/editor-plugins/feedback-dialog');
jest.mock('@atlaskit/editor-plugins/placeholder');
jest.mock('@atlaskit/editor-plugins/selection');
jest.mock('@atlaskit/editor-plugins/code-block');
jest.mock('@atlaskit/editor-plugins/layout');
jest.mock('@atlaskit/editor-plugins/submit-editor');
jest.mock('@atlaskit/editor-plugins/quick-insert');
jest.mock('@atlaskit/editor-plugins/card');
jest.mock('@atlaskit/editor-plugins/table');
jest.mock('@atlaskit/editor-plugins/context-panel');
jest.mock('@atlaskit/editor-plugins/help-dialog');
jest.mock('@atlaskit/editor-plugins/media');
jest.mock('@atlaskit/editor-plugins/status');
jest.mock('@atlaskit/editor-plugins/scroll-into-view');
jest.mock('@atlaskit/editor-plugins/history');
jest.mock('@atlaskit/editor-plugins/placeholder-text');
jest.mock('@atlaskit/editor-plugins/analytics');
jest.mock('@atlaskit/editor-plugins/insert-block');
jest.mock('@atlaskit/editor-plugins/find-replace');

import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { contextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import { feedbackDialogPlugin } from '@atlaskit/editor-plugins/feedback-dialog';
import { findReplacePlugin } from '@atlaskit/editor-plugins/find-replace';
import { helpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { placeholderPlugin } from '@atlaskit/editor-plugins/placeholder';
import { placeholderTextPlugin } from '@atlaskit/editor-plugins/placeholder-text';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { scrollIntoViewPlugin } from '@atlaskit/editor-plugins/scroll-into-view';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { submitEditorPlugin } from '@atlaskit/editor-plugins/submit-editor';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';

import type { EditorProps } from '../../../types';
import createPluginsListBase, { getScrollGutterOptions } from '../../create-plugins-list';
import { createPreset } from '../../create-preset';

const createPluginsList = (props: EditorProps, prevProps?: EditorProps) => {
	createPluginsListBase(createPreset(props, prevProps), props);
};

describe('createPluginsList', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should add helpDialogPlugin if allowHelpDialog is true', () => {
		createPluginsList({ allowHelpDialog: true });
		expect(helpDialogPlugin).toHaveBeenCalledWith({ config: false });
	});

	it('should add tablePlugin if allowTables is true', () => {
		const tableOptions = { allowTables: true };
		createPluginsList(tableOptions);
		expect(tablesPlugin).toHaveBeenCalledTimes(1);
		expect(tablesPlugin).toHaveBeenCalledWith({
			config: expect.objectContaining({
				fullWidthEnabled: false,
				wasFullWidthEnabled: undefined,
			}),
		});
	});

	it('should add tablePlugin if allowTables is true where previous appearance was full-width', () => {
		const tableOptions = { allowTables: true };
		const prevProps: EditorProps = { appearance: 'full-width' };
		createPluginsList(tableOptions, prevProps);
		expect(tablesPlugin).toHaveBeenCalledTimes(1);
		expect(tablesPlugin).toHaveBeenCalledWith({
			config: expect.objectContaining({
				fullWidthEnabled: false,
				wasFullWidthEnabled: true,
			}),
		});
	});

	it('should add tablePlugin if allowTables is true where previous appearance was mobile', () => {
		const tableOptions = { allowTables: true };
		const prevProps: EditorProps = { appearance: 'mobile' };
		createPluginsList(tableOptions, prevProps);
		expect(tablesPlugin).toHaveBeenCalledTimes(1);
		expect(tablesPlugin).toHaveBeenCalledWith({
			config: expect.objectContaining({
				fullWidthEnabled: false,
				wasFullWidthEnabled: false,
			}),
		});
	});

	it('should always add submitEditorPlugin to the editor', () => {
		createPluginsList({});
		expect(submitEditorPlugin).toHaveBeenCalled();
	});

	it('should always add quickInsert', () => {
		createPluginsList({});
		expect(quickInsertPlugin).toHaveBeenCalled();
	});

	it('should add quickInsertPlugin with special options when appearance === "mobile"', () => {
		createPluginsList({ appearance: 'mobile' });
		expect(quickInsertPlugin).toHaveBeenCalledWith({
			config: {
				disableDefaultItems: true,
				headless: true,
			},
		});
	});

	it('should add selectionPlugin with useLongPressSelection disable when appearance === "mobile"', () => {
		createPluginsList({ appearance: 'mobile' });

		expect(selectionPlugin).toHaveBeenCalledWith({
			config: {
				useLongPressSelection: false,
			},
		});
	});

	it('should add mediaPlugin if media prop is provided', () => {
		const media = {
			provider: Promise.resolve() as any,
			allowMediaSingle: true,
		};
		createPluginsList({ media });
		expect(mediaPlugin).toHaveBeenCalledTimes(1);
	});

	it('should add placeholderText plugin if allowTemplatePlaceholders prop is provided', () => {
		createPluginsList({ allowTemplatePlaceholders: true });
		expect(placeholderTextPlugin).toHaveBeenCalled();
	});

	it('should pass empty options to placeholderText plugin if allowTemplatePlaceholders is true', () => {
		createPluginsList({ allowTemplatePlaceholders: true });
		expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
		expect(placeholderTextPlugin).toHaveBeenCalledWith({ config: {} });
	});

	it('should enable allowInserting for placeholderText plugin if options.allowInserting is true', () => {
		createPluginsList({ allowTemplatePlaceholders: { allowInserting: true } });
		expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
		expect(placeholderTextPlugin).toHaveBeenCalledWith({
			config: {
				allowInserting: true,
			},
		});
	});

	it('should add layoutPlugin if allowLayout prop is provided', () => {
		createPluginsList({ allowLayouts: true });
		expect(layoutPlugin).toHaveBeenCalled();
	});

	it('should initialise hyperlink with link picker plugins', () => {
		const linkPickerPlugins: Array<never> = [];

		createPluginsList({
			linking: { linkPicker: { plugins: linkPickerPlugins } },
		});

		expect(hyperlinkPlugin).toHaveBeenCalledWith({
			config: expect.objectContaining({
				linkPicker: {
					plugins: linkPickerPlugins,
				},
			}),
		});
	});

	it('should add cardPlugin if `linking.smartLinks` is provided', () => {
		const smartLinks = { allowEmbeds: true };
		const linkPickerPlugins: Array<never> = [];

		createPluginsList({
			linking: { smartLinks, linkPicker: { plugins: linkPickerPlugins } },
		});

		expect(cardPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					allowEmbeds: true,
					platform: 'web',
					fullWidthMode: false,
					linkPicker: {
						plugins: linkPickerPlugins,
					},
				}),
			}),
		);
	});

	it('should add cardPlugin, falling back to `smartLinks` prop if `linking.smartLinks` is not provided', () => {
		const smartLinks = { allowEmbeds: true };
		const linkPickerPlugins: Array<never> = [];

		createPluginsList({
			smartLinks,
			linking: { linkPicker: { plugins: linkPickerPlugins } },
		});

		expect(cardPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					allowEmbeds: true,
					platform: 'web',
					fullWidthMode: false,
					linkPicker: {
						plugins: linkPickerPlugins,
					},
				}),
			}),
		);
	});

	it('should add cardPlugin, preferring `linking.smartLinks` over `smartLinks` prop if both are provided', () => {
		const smartLinks = { allowEmbeds: true };
		const linkingSmartLinks = { allowEmbeds: false };
		const linkPickerPlugins: Array<never> = [];

		createPluginsList({
			smartLinks,
			linking: {
				smartLinks: linkingSmartLinks,
				linkPicker: { plugins: linkPickerPlugins },
			},
		});

		expect(cardPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					allowEmbeds: false,
					platform: 'web',
					fullWidthMode: false,
					linkPicker: {
						plugins: linkPickerPlugins,
					},
				}),
			}),
		);
	});

	it('should not add statusPlugin if allowStatus prop is false', () => {
		createPluginsList({ allowStatus: false });
		expect(statusPlugin).not.toBeCalled();
		expect(insertBlockPlugin).toBeCalledWith({
			config: expect.objectContaining({ nativeStatusSupported: false }),
		});
	});

	it('should add statusPlugin if allowStatus prop is true', () => {
		createPluginsList({ allowStatus: true });
		expect(statusPlugin).toHaveBeenCalledTimes(1);
		expect(statusPlugin).toHaveBeenCalledWith({
			config: {
				menuDisabled: false,
				allowZeroWidthSpaceAfter: true,
				getEditorFeatureFlags: expect.any(Function),
			},
		});
		expect(insertBlockPlugin).toBeCalledWith({
			config: expect.objectContaining({ nativeStatusSupported: true }),
		});
	});

	it('should add statusPlugin if allowStatus prop is provided with menuDisabled true', () => {
		createPluginsList({ allowStatus: { menuDisabled: true } });
		expect(statusPlugin).toHaveBeenCalledTimes(1);
		expect(statusPlugin).toHaveBeenCalledWith({
			config: {
				menuDisabled: true,
				allowZeroWidthSpaceAfter: true,
				getEditorFeatureFlags: expect.any(Function),
			},
		});
		expect(insertBlockPlugin).toBeCalledWith({
			config: expect.objectContaining({ nativeStatusSupported: false }),
		});
	});

	it('should add statusPlugin if allowStatus prop is provided with menuDisabled false', () => {
		createPluginsList({ allowStatus: { menuDisabled: false } });
		expect(statusPlugin).toHaveBeenCalledTimes(1);
		expect(statusPlugin).toHaveBeenCalledWith({
			config: {
				menuDisabled: false,
				allowZeroWidthSpaceAfter: true,
				getEditorFeatureFlags: expect.any(Function),
			},
		});
		expect(insertBlockPlugin).toBeCalledWith({
			config: expect.objectContaining({ nativeStatusSupported: true }),
		});
	});

	it('should add analyticsPlugin if allowAnalyticsGASV3 prop is provided', () => {
		createPluginsList({ allowAnalyticsGASV3: true }, undefined);
		expect(analyticsPlugin).toHaveBeenCalledTimes(1);
		expect(analyticsPlugin).toHaveBeenCalledWith({
			config: {
				performanceTracking: undefined,
			},
		});
	});

	it('should no add analyticsPlugin if allowAnalyticsGASV3 prop is false', () => {
		createPluginsList({ allowAnalyticsGASV3: false }, undefined);
		expect(analyticsPlugin).not.toHaveBeenCalled();
	});

	it('should add feedbackDialogPlugin if feedbackInfo is provided for editor props', () => {
		const feedbackInfo = {
			product: 'bitbucket',
			packageName: 'editor',
			packageVersion: '1.1.1',
		};
		createPluginsList({ feedbackInfo });
		expect(feedbackDialogPlugin).toBeCalledWith({
			config: { coreVersion: '0.0.0', ...feedbackInfo },
		});
	});

	it('should always add insertBlockPlugin to the editor with insertMenuItems', () => {
		const customItems = [
			{
				content: 'a',
				value: { name: 'a' },
				tooltipDescription: 'item a',
				tooltipPosition: 'right',
				onClick: () => {},
			},
			{
				content: 'b',
				value: { name: 'b' },
				tooltipDescription: 'item b',
				tooltipPosition: 'right',
				onClick: () => {},
			},
		];

		const props = {
			allowExpand: false,
			allowTables: true,
			insertMenuItems: customItems,
			nativeStatusSupported: false,
			replacePlusMenuWithElementBrowser: false,
			showElementBrowserLink: false,
		};

		createPluginsList(props);
		expect(insertBlockPlugin).toHaveBeenCalledTimes(1);
		expect(insertBlockPlugin).toHaveBeenCalledWith({ config: props });
	});

	it('should add historyPlugin to mobile editor', () => {
		createPluginsList({ appearance: 'mobile' });
		expect(historyPlugin).toHaveBeenCalled();
	});

	it('should not add historyPlugin to non-mobile editor', () => {
		createPluginsList({ appearance: 'full-page' });
		expect(historyPlugin).not.toHaveBeenCalled();
	});

	it('should add contextPanelPlugin by default', () => {
		createPluginsList({ appearance: 'full-page' });
		expect(contextPanelPlugin).toHaveBeenCalled();
	});

	describe('scrollIntoViewPlugin', () => {
		it('should add plugin by default', () => {
			createPluginsList({ appearance: 'full-page' });
			expect(scrollIntoViewPlugin).toHaveBeenCalled();
		});

		it('should not add plugin if props.autoScrollIntoView === false', () => {
			createPluginsList({ appearance: 'full-page', autoScrollIntoView: false });
			expect(scrollIntoViewPlugin).not.toHaveBeenCalled();
		});
	});

	describe('placeholderPlugin', () => {
		it('should pass placeholder text from editor props', function () {
			const defaultPlaceholder = 'Hello World!';
			createPluginsList({ placeholder: defaultPlaceholder });

			expect(placeholderPlugin).toHaveBeenCalledWith({
				config: {
					placeholder: defaultPlaceholder,
				},
			});
		});
	});

	describe('findReplacePlugin', () => {
		it('should not add plugin by default', () => {
			createPluginsList({ appearance: 'full-page' });
			expect(findReplacePlugin).not.toHaveBeenCalled();
		});

		it('should add plugin if props.allowFindReplace === true', () => {
			createPluginsList({ appearance: 'full-page', allowFindReplace: true });
			expect(findReplacePlugin).toHaveBeenCalled();
		});
	});

	describe('getScrollGutterOptions', () => {
		it('should return ScrollGutterPluginOptions with persistScrollGutter as true', () => {
			const scrollGutterOptions = getScrollGutterOptions({
				appearance: 'mobile',
				persistScrollGutter: true,
			});

			expect(scrollGutterOptions?.persistScrollGutter).toBe(true);
		});

		it('should return ScrollGutterPluginOptions with gutterSize as 36', () => {
			const scrollGutterOptions = getScrollGutterOptions({
				appearance: 'mobile',
			});

			expect(scrollGutterOptions?.gutterSize).toBe(36);
		});
	});

	describe('codeblock', () => {
		it('should pass allowCompositionInputOverride when mobile editor', () => {
			createPluginsList({ appearance: 'mobile' });
			expect(codeBlockPlugin).toHaveBeenCalledWith({
				config: {
					allowCompositionInputOverride: true,
					appearance: 'mobile',
					useLongPressSelection: false,
					getEditorFeatureFlags: expect.any(Function),
				},
			});
		});

		it('should not pass allowCompositionInputOverride when not mobile editor', () => {
			createPluginsList({ appearance: 'full-page' });
			expect(codeBlockPlugin).toHaveBeenCalledWith({
				config: {
					allowCompositionInputOverride: false,
					appearance: 'full-page',
					useLongPressSelection: false,
					getEditorFeatureFlags: expect.any(Function),
				},
			});
		});
	});
});
