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

snapshot(BlockExtension);
snapshot(BlockExtensionWithSmartLink);
snapshot(BodiedExtension);
snapshot(BodiedExtensionWithSmartLink);
snapshot(InlineExtension);
snapshot(InlineExtensionCenterAligned);
snapshot(InlineExtensionRightAligned);
snapshot(InlineExtensionWithSmartLink);
