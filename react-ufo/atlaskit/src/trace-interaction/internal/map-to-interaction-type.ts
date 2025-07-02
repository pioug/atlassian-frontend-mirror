function mapToInteractionType(eventType: string) {
	if (eventType === 'click' || eventType === 'dblclick' || eventType === 'mousedown') {
		return 'press';
	}
	if (eventType === 'mouseenter' || eventType === 'mouseover') {
		return 'hover';
	}
	return undefined;
}

export default mapToInteractionType;
