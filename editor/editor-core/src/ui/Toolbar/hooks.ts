import React from 'react';

export const useElementWidth = (
  ref: React.RefObject<HTMLElement>,
  { skip }: { skip: boolean },
): number | undefined => {
  const [elementWidth, setWidth] = React.useState<number | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (!skip && ref.current) {
      setWidth(Math.round(ref.current.getBoundingClientRect().width));
    }
  }, [skip, setWidth, ref]);

  return elementWidth;
};
