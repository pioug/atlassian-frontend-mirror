import { snapshot } from '@af/visual-regression';
import { Caption, CaptionLong, CaptionComplicated } from './captions.fixtures';

snapshot(Caption, {
	description: 'should render caption correctly',
});

snapshot(CaptionLong, {
	description: 'should render long caption correctly',
});

snapshot(CaptionComplicated, {
	description: 'should render complicated caption correctly',
});
