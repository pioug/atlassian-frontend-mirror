export default (mutation: MutationRecord | { type: 'selection'; target: Element }) => {
	const {
		type,
		target: { nodeName, firstChild },
	} = mutation;

	if (
		type === 'selection' &&
		nodeName?.toUpperCase() === 'DIV' &&
		firstChild?.nodeName.toUpperCase() === 'TABLE'
	) {
		return false;
	}

	// ED-16668
	// Do not remove this fixes an issue with windows firefox that relates to
	// the addition of the shadow sentinels
	if (
		type === 'selection' &&
		nodeName?.toUpperCase() === 'TABLE' &&
		(firstChild?.nodeName.toUpperCase() === 'COLGROUP' ||
			firstChild?.nodeName.toUpperCase() === 'SPAN')
	) {
		return false;
	}

	return true;
};
