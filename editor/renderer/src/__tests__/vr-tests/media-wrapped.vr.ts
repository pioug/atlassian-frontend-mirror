import { snapshot } from '@af/visual-regression';
import {
	MediaWrapped,
	MediaWrappedText,
	MediaWrappedTextSplit,
	MediaWrappedSmall,
} from './media-wrapped.fixture';

snapshot(MediaWrapped, {
	description: 'should render 2 media items in 1 line when wrapped',
});

snapshot(MediaWrappedText, {
	description: 'should render 2 media items in 1 line when wrapped with text in between',
});

snapshot(MediaWrappedTextSplit, {
	description: 'should render 2 media items in 2 lines when wrapped with a large enough width',
});

snapshot(MediaWrappedSmall, {
	description: 'should render 2 media items in 1 line when wrapped without dynamic text sizing',
});
