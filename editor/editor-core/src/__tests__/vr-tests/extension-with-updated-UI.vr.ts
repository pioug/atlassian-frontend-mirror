import { snapshot } from '@af/visual-regression';

import {
	BlockExtension,
	BlockExtensionWithSmartLink,
	BodiedExtension,
	BodiedExtensionWithSmartLink,
	InlineExtension,
	InlineExtensionCenterAligned,
	InlineExtensionRightAligned,
	InlineExtensionWithSmartLink,
} from './extension-with-updated-UI.fixtures';

snapshot(BlockExtension, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(BlockExtensionWithSmartLink, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(BodiedExtension, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(BodiedExtensionWithSmartLink, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(InlineExtension, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(InlineExtensionCenterAligned, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(InlineExtensionRightAligned, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
snapshot(InlineExtensionWithSmartLink, {
	featureFlags: {
		'platform.editor.react-18-portal': true,
	},
});
