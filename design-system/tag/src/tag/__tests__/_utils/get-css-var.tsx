const getCSSVar = (element: HTMLElement, name: string): string => {
	const styles = getComputedStyle(element);
	return styles.getPropertyValue(name);
};

export default getCSSVar;
