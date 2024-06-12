import {
	EditorExtensionFloatingToolbarModel,
	EditorNodeContainerModel,
	EditorPageModel,
} from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import {
	BlockExtension,
	BlockExtensionWithSmartLink,
	BodiedExtension,
	BodiedExtensionWithSmartLink,
	InlineExtension,
	InlineExtensionCenterAligned,
	InlineExtensionRightAligned,
	InlineExtensionWithSmartLink,
} from '../../vr-tests/extension-with-updated-UI.fixtures';

const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

snapshotInformational(BlockExtension, {
	description: 'Block extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BlockExtension, {
	description: 'Block extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BlockExtension, {
	description: 'Block extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension label showing on top of smart link',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension label showing on top of smart link after width change',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.fullWidth();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtension, {
	description: 'Inline extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtension, {
	description: 'Inline extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtension, {
	description: 'Inline extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtensionWithSmartLink, {
	description: 'Inline extension label showing on top of smart link',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtensionCenterAligned, {
	description: 'Extension label showing on properly for center aligned inline extension',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(InlineExtensionRightAligned, {
	description: 'Extension label showing on properly for right (end) aligned inline extension',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BodiedExtension, {
	description: 'Bodied extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BodiedExtension, {
	description: 'Bodied extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BodiedExtension, {
	description: 'Bodied extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.hover();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension label showing on top of smart link',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension label showing on top of smart link after width change',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page, component) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.fullWidth();
	},
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
