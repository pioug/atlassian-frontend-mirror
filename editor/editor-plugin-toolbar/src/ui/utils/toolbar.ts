export const isEventInContainer = (event: Event, containerSelector: string): boolean => {
	const target = event.target instanceof Element ? event.target : null;

	if (!target) {
		return false;
	}

	return !!target.closest(containerSelector);
};
