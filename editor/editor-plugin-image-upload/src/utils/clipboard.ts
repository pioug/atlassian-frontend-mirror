// Typeguard Function
export const isClipboardEvent = (event: Event): event is ClipboardEvent => 'clipboardData' in event;
