export default function isCheckboxItem(element: HTMLElement) {
  const role = element.getAttribute('role');

  return role === 'radio' || role === 'menuitemradio';
}
