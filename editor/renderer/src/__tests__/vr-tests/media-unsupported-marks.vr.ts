import { snapshot } from '@af/visual-regression';
import { MediaWithUnsupportedMarks } from './media-unsupported-marks.fixture';

snapshot(MediaWithUnsupportedMarks, {
	description: 'should render media item which contains unsupported node attributes',
});
