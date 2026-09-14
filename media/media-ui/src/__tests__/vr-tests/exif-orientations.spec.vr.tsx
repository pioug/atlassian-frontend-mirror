import { snapshot } from '@af/visual-regression';
import { Example } from '../../../examples/exif-orientations-vr.vr.ap';

snapshot(Example, {
	description: 'Exif Orientations VR',
	drawsOutsideBounds: true,
});
