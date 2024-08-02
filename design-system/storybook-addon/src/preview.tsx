/**
 * A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators
 * in order to augment stories:
 * - with extra rendering
 * - gather details about how a story is rendered
 *
 * When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.
 *
 * https://storybook.js.org/docs/react/writing-stories/decorators
 */
// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
import type { ProjectAnnotations, Renderer } from '@storybook/types';

import withDesignTokens from './decorator';

const preview: ProjectAnnotations<Renderer> = {
	decorators: [withDesignTokens],
	globals: {
		adsTheme: 'auto',
	},
};

export default preview;
