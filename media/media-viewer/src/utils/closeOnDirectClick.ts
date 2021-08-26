import { MouseEventHandler } from 'react';

export function closeOnDirectClick<T>(
  onClose?: () => void,
): MouseEventHandler<T> {
  return (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
}
