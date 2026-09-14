import { Rectangle } from '@atlaskit/media-ui/rectangle';

export const clientRectangle = (el: HTMLElement): Rectangle => {
	const { clientWidth, clientHeight } = el;
	return new Rectangle(clientWidth, clientHeight);
};
