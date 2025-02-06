import { EditorNodeContainerModel, EditorPageModel } from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import {
	BlockExtensionWithSmartLink,
	EmptyBodiedExtension,
	BodiedExtensionWithSmartLink,
	InlineExtensionWithSmartLink,
} from '../../vr-tests/extension-live-page-view-mode.fixtures';

const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

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
