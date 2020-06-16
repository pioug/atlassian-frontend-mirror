import { useEffect } from 'react';

function useUpdateCssVar(cssVar: string, value: number | string) {
  useEffect(() => {
    document.documentElement.style.setProperty(`--${cssVar}`, `${value}px`);

    return () => {
      document.documentElement.style.removeProperty(`--${cssVar}`);
    };
  }, [cssVar, value]);
}

export default useUpdateCssVar;
