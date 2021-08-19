import { useEffect, useRef, useState } from 'react';

export default function useFocus() {
  const [isFocused, setIsFocused] = useState(false);

  // ensure bindFocus has a stable ref
  const bindFocus = useRef({
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  useEffect(() => {
    // handle the case where a component might
    // unmount while being focused.
    return () => setIsFocused(false);
  }, []);

  return {
    isFocused,
    bindFocus: bindFocus.current,
  };
}
