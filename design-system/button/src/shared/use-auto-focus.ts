import { useEffect, useState } from 'react';

// Autofocus is only applicable to initial load
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/autofocus
export default function useAutoFocus(
  ref: React.MutableRefObject<HTMLElement | null | undefined>,
  autoFocus: boolean,
) {
  const initialAutoFocus = useState(autoFocus)[0];
  useEffect(
    function onMount() {
      if (initialAutoFocus && ref.current) {
        ref.current.focus();
      }
    },
    [initialAutoFocus, ref],
  );
}
