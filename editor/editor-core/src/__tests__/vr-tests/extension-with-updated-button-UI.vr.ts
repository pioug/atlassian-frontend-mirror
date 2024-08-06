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
} from './extension-with-updated-button-UI.fixtures';

snapshot(BlockExtension);
snapshot(BlockExtensionWithSmartLink, {
	featureFlags: { 'linking-platform-increase-inline-card-icon-size': [true, false] },
});
snapshot(BodiedExtension);
snapshot(BodiedExtensionWithSmartLink, {
	featureFlags: { 'linking-platform-increase-inline-card-icon-size': [true, false] },
});
snapshot(InlineExtension);
snapshot(InlineExtensionCenterAligned);
snapshot(InlineExtensionRightAligned);
snapshot(InlineExtensionWithSmartLink, {
	featureFlags: { 'linking-platform-increase-inline-card-icon-size': [true, false] },
});
