import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AvatarPickerWithSourceExample from './0-avatar-picker-with-source';
import AvatarPickerWithSourceAltTextExample from './0-avatar-picker-with-source-alt-text';
import AvatarPickerWithoutPredefinedAvatarsExample from './0-avatar-picker-without-predefined-avatars';
import AvatarPickerWithoutSourceExample from './0-avatar-picker-without-source';
import ImageCropperExample from './1-image-cropper';
import ImageNavigatorRemoteExample from './2-image-navigator-remote';
import ImageNavigatorSmallExample from './2-image-navigator-small';
import ImageNavigatorTallExample from './2-image-navigator-tall';
import ImageNavigatorUploaderExample from './2-image-navigator-uploader';
import PredefinedAvatarsExample from './3-predefined-avatars';
import AvatarPickerWithPredefinedAvatarExample from './4-avatar-picker-with-predefined-avatar';
import AvatarPickerWithPredefinedAvatarRequireAltTextExample from './4-avatar-picker-with-predefined-avatar-require-alt-text';
import AvatarPickerWithCustomisedLabelsExample from './5-avatar-picker-with-customised-labels';
import AvatarPickerWithErrorstateExample from './6-avatar-picker-with-errorstate';
import AvatarPickerWithErrorstateClippedTextExample from './6-avatar-picker-with-errorstate-clipped-text';
import AvatarPickerLoadingExample from './7-avatar-picker-loading';
import ImagePlacerExample from './8-image-placer';
import AvatarPickerWithViewportDebugExample from './9-avatar-picker-with-viewport-debug';
import AvatarPickerLargerOutputSizeExample from './10-avatar-picker-larger-output-size';
import AvatarPickerSmallerOutputSizeExample from './10-avatar-picker-smaller-output-size';

export const AvatarPickerWithSourceAltText: WorkbenchExample = wb(
	AvatarPickerWithSourceAltTextExample,
);
export const AvatarPickerWithSource: WorkbenchExample = wb(AvatarPickerWithSourceExample);
export const AvatarPickerWithoutPredefinedAvatars: WorkbenchExample = wb(
	AvatarPickerWithoutPredefinedAvatarsExample,
);
export const AvatarPickerWithoutSource: WorkbenchExample = wb(AvatarPickerWithoutSourceExample);
export const ImageCropper: WorkbenchExample = wb(ImageCropperExample);
export const AvatarPickerLargerOutputSize: WorkbenchExample = wb(
	AvatarPickerLargerOutputSizeExample,
);
export const AvatarPickerSmallerOutputSize: WorkbenchExample = wb(
	AvatarPickerSmallerOutputSizeExample,
);
export const ImageNavigatorRemote: WorkbenchExample = wb(ImageNavigatorRemoteExample);
export const ImageNavigatorSmall: WorkbenchExample = wb(ImageNavigatorSmallExample);
export const ImageNavigatorTall: WorkbenchExample = wb(ImageNavigatorTallExample);
export const ImageNavigatorUploader: WorkbenchExample = wb(ImageNavigatorUploaderExample);
export const PredefinedAvatars: WorkbenchExample = wb(PredefinedAvatarsExample);
export const AvatarPickerWithPredefinedAvatarRequireAltText: WorkbenchExample = wb(
	AvatarPickerWithPredefinedAvatarRequireAltTextExample,
);
export const AvatarPickerWithPredefinedAvatar: WorkbenchExample = wb(
	AvatarPickerWithPredefinedAvatarExample,
);
export const AvatarPickerWithCustomisedLabels: WorkbenchExample = wb(
	AvatarPickerWithCustomisedLabelsExample,
);
export const AvatarPickerWithErrorstateClippedText: WorkbenchExample = wb(
	AvatarPickerWithErrorstateClippedTextExample,
);
export const AvatarPickerWithErrorstate: WorkbenchExample = wb(AvatarPickerWithErrorstateExample);
export const AvatarPickerLoading: WorkbenchExample = wb(AvatarPickerLoadingExample);
export const ImagePlacer: WorkbenchExample = wb(ImagePlacerExample);
export const AvatarPickerWithViewportDebug: WorkbenchExample = wb(
	AvatarPickerWithViewportDebugExample,
);
