import { snapshot } from '@af/visual-regression';
import {
	MediaInlineADF,
	MediaInlineInParagraphADF,
	MediaInlineMultipleInParagraphADF,
	MediaInlineADFWithReactLooselyLazy,
} from './media-inline.fixtures';

snapshot(MediaInlineADF, {
	description: 'should render standalone component',
});

snapshot(MediaInlineInParagraphADF, {
	description: 'should render in paragraph',
});

snapshot(MediaInlineMultipleInParagraphADF, {
	description: 'should render multiple in paragraph',
});

snapshot(MediaInlineADFWithReactLooselyLazy, {
	description: 'should render standalone component when using react loosely lazy',
});
