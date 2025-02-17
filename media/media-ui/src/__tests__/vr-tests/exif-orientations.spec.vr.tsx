import { snapshot } from '@af/visual-regression';
import { Example as ExifOrientationsVr } from '../../../examples/exif-orientations-vr';

snapshot(ExifOrientationsVr, {
	drawsOutsideBounds: true,
});
