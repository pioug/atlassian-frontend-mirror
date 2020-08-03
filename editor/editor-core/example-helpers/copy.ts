export function copy(value: string): void {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, value.length);
  document.execCommand('copy');
  input.remove();
}
