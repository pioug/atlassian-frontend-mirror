import { exitFullscreen } from './exitFullscreen';
import { getFullscreenElement } from './getFullscreenElement';
import { requestFullscreen } from './requestFullscreen';

export const toggleFullscreen = (element?: HTMLElement): void => {
	if (getFullscreenElement()) {
		exitFullscreen();
	} else if (element) {
		requestFullscreen(element);
	}
};
