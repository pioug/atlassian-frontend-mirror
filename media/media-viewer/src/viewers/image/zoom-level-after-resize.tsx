import type { Camera } from '@atlaskit/media-ui/camera/camera';

import { ZoomLevel } from '../../domain/zoomLevel';

export function zoomLevelAfterResize(
	newCamera: Camera,
	oldCamera: Camera,
	oldZoomLevel: ZoomLevel,
): ZoomLevel {
	const isImgScaledToFit = oldZoomLevel.value === oldCamera.scaleDownToFit;
	const zoomLevelToRefit = new ZoomLevel(newCamera.scaleDownToFit);
	return isImgScaledToFit ? zoomLevelToRefit : oldZoomLevel;
}
