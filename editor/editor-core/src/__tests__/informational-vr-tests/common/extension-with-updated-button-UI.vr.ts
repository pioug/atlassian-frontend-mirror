import {
	EditorExtensionFloatingToolbarModel,
	EditorNodeContainerModel,
	EditorPageModel,
} from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import {
	BlockExtension,
	BlockExtensionWithLayout,
	BlockExtensionWithSmartLink,
	BodiedExtension,
	BodiedExtensionWithLayout,
	BodiedExtensionWithSmartLink,
	HeadingWithInlineExtension,
	InlineExtension,
	InlineExtensionCenterAligned,
	InlineExtensionRightAligned,
	InlineExtensionWithSmartLink,
} from '../../vr-tests/extension-with-updated-button-UI.fixtures';

const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

snapshotInformational(BlockExtension, {
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

snapshotInformational(BlockExtension, {
	description: 'Block extension danger state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	featureFlags: {
		platform_editor_extension_styles: true,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.removeButton.hover();
		await toolbarModel.waitForTooltip();
	},
});

snapshotInformational(BlockExtension, {
	description: 'Block extension hovered state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	featureFlags: {
		platform_editor_extension_styles: true,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.hover();
	},
});

snapshotInformational(BlockExtensionWithSmartLink, {
	description: 'Block extension label showing on top of smart link',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	featureFlags: {
		platform_editor_extension_styles: true,
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
	description: 'Block extension label showing on top of smart link after width change',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.extension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.fullWidth();
		await toolbarModel.waitForTooltip();
	},
});

snapshotInformational(InlineExtension, {
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

snapshotInformational(InlineExtension, {
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
		await toolbarModel.waitForTooltip();
	},
});

snapshotInformational(InlineExtension, {
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

snapshotInformational(InlineExtensionWithSmartLink, {
	description: 'Inline extension label showing on top of smart link',
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

snapshotInformational(InlineExtensionCenterAligned, {
	description: 'Extension label showing on properly for center aligned inline extension',
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

snapshotInformational(InlineExtensionRightAligned, {
	description: 'Extension label showing on properly for right (end) aligned inline extension',
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

snapshotInformational(HeadingWithInlineExtension, {
	description: 'Extension label showing proper styles inline with a heading',
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

snapshotInformational(BodiedExtension, {
	description: 'Bodied extension selected state',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(BodiedExtension, {
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
		await toolbarModel.waitForTooltip();
	},
});

snapshotInformational(BodiedExtension, {
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
	description: 'Bodied extension label showing on top of smart link',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(BodiedExtensionWithSmartLink, {
	description: 'Bodied extension label showing on top of smart link after width change',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
		await toolbarModel.fullWidth();
		await toolbarModel.waitForTooltip();
	},
});

snapshotInformational(BodiedExtensionWithLayout, {
	description: 'Selected bodied extension label with a layout element',
	selector: {
		byTestId: CONTENT_AREA_TEST_ID,
	},
	prepare: async (page) => {
		const editor = await EditorPageModel.from({ page });
		const nodes = EditorNodeContainerModel.from(editor);
		await nodes.bodiedExtension.click();
		const toolbarModel = EditorExtensionFloatingToolbarModel.from(editor);
		await toolbarModel.waitForStable();
	},
});

snapshotInformational(BlockExtensionWithLayout, {
	description: 'Selected block extension label with a layout element',
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
