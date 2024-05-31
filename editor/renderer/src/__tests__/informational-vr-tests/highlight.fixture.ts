import * as adfBackgroundColorYellow from '../__fixtures__/highlight-yellow.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents';

export const BackgroundColorYellow = generateRendererComponent({
	document: adfBackgroundColorYellow,
	appearance: 'comment',
});
