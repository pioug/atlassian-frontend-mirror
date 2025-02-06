import { snapshot } from '@af/visual-regression';

import {
	BlockExtensionWithSmartLink,
	BodiedExtensionWithSmartLink,
	EmptyBodiedExtension,
	InlineExtensionWithSmartLink,
} from './extension-live-page-view-mode.fixtures';

snapshot(BlockExtensionWithSmartLink);
snapshot(BodiedExtensionWithSmartLink);
snapshot(EmptyBodiedExtension);
snapshot(InlineExtensionWithSmartLink);
