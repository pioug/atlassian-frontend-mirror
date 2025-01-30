import {
	EditorExtensionFloatingToolbarModel,
	EditorNodeContainerModel,
	EditorPageModel,
} from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import {
	BlockExtensionWithSmartLink,
	EmptyBodiedExtension,
	BodiedExtensionWithSmartLink,
	InlineExtensionWithSmartLink,
} from '../../vr-tests/1P-bodied-extension-edit-button-enabled.fixtures';

const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
});

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.hover();
	},
});

snapshotInformational(InlineExtensionWithSmartLink, {
	description: 'Inline extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(InlineExtensionWithSmartLink, {
	description: 'Inline extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
});

snapshotInformational(InlineExtensionWithSmartLink, {
	description: 'Inline extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.inlineExtension.hover();
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extensionLabel.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.hover();
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
});

snapshotInformational(EmptyBodiedExtension, {
	description: 'Empty bodied extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extensionLabel.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(EmptyBodiedExtension, {
	description: 'Empty bodied extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
	},
});

snapshotInformational(EmptyBodiedExtension, {
	description: 'Empty bodied extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.hover();
	},
});
