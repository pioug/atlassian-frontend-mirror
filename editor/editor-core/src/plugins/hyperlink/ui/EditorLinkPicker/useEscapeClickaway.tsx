import { useEffect, useRef } from 'react';

export const useEscapeClickaway = <T extends HTMLElement>(
  /** Callback to fire when the user presses the escape key */
  onEscape: () => void,
  /** Callback to fire when the user clicks an element not contained by the ref */
  onClickAway: () => void,
) => {
  const ref: React.MutableRefObject<T | null> = useRef<T>(null);

  useEffect(() => {
    const handleClickAway = (event: Event) => {
      const el = ref.current;
      if (event.target instanceof Element && el && !el.contains(event.target)) {
        onClickAway();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClickAway, onEscape]);

  return ref;
};
