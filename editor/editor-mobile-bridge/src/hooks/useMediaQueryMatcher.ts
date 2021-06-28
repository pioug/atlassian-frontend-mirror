import { useEffect, useState } from 'react';

export type MediaMatcher<T> = {
  query: string;
  value: T;
};

export function useMediaQueryMatcher<T>(mediaList: MediaMatcher<T>[]) {
  const mediaQueryLists = mediaList.map((media) =>
    window.matchMedia(media.query),
  );

  const getValue = () => {
    const index = mediaQueryLists.findIndex((query) => query.matches);
    return index >= 0 ? mediaList[index].value : null;
  };

  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach((query) => query.addListener(handler));
      return () =>
        mediaQueryLists.forEach((query) => query.removeListener(handler));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return value;
}
