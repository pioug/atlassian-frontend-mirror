import { Rectangle } from '@atlaskit/media-ui/rectangle';

// Matches inset viewer header/footer horizontal padding (space.300).
const INSET_VIEWER_FIT_GUTTER_PX = 24;

export const insetFittedViewport = (el: HTMLElement): Rectangle => {
	const { clientWidth, clientHeight } = el;
	return new Rectangle(Math.max(0, clientWidth - INSET_VIEWER_FIT_GUTTER_PX * 2), clientHeight);
};
