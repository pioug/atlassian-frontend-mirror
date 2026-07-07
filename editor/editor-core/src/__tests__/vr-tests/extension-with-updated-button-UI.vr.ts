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
snapshot(BlockExtensionWithSmartLink, { waitForReactLazy: true });
snapshot(BodiedExtension);
snapshot(BodiedExtensionWithSmartLink, { waitForReactLazy: true });
snapshot(InlineExtension);
snapshot(InlineExtensionCenterAligned, { waitForReactLazy: true });
snapshot(InlineExtensionRightAligned, { waitForReactLazy: true });
snapshot(InlineExtensionWithSmartLink, { waitForReactLazy: true });
snapshot(HeadingWithInlineExtension, { waitForReactLazy: true });
