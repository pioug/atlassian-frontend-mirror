import { snapshot } from '@af/visual-regression';

import {
	BlockExtension,
	BlockExtensionWithSmartLink,
	BodiedExtension,
	BodiedExtensionWithSmartLink,
	HeadingWithInlineExtension,
	InlineExtension,
	InlineExtensionCenterAligned,
	InlineExtensionRightAligned,
	InlineExtensionWithSmartLink,
} from './extension-with-updated-button-UI.fixtures';

snapshot(BlockExtension);
snapshot(BlockExtensionWithSmartLink);
snapshot(BodiedExtension);
snapshot(BodiedExtensionWithSmartLink);
snapshot(InlineExtension);
snapshot(InlineExtensionCenterAligned);
snapshot(InlineExtensionRightAligned);
snapshot(InlineExtensionWithSmartLink);
snapshot(HeadingWithInlineExtension);
