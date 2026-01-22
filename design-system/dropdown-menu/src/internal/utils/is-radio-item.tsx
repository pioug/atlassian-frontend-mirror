export default function isCheckboxItem(element: HTMLElement): boolean {
	const role = element.getAttribute('role');

	return role === 'radio' || role === 'menuitemradio';
}
