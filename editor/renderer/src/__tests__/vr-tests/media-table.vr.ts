import { snapshot } from '@af/visual-regression';
import { MediaBiggerThanColumnWidth } from './media-table.fixture';

// EDM-1081
snapshot(MediaBiggerThanColumnWidth, {
	description: 'should render correct aspect ratio with image width bigger than table column width',
});
