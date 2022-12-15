/** @jsx jsx */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { useThemeObserver } from '@atlaskit/tokens';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Image URL to use for dark mode. This overrides `src` when the user
   * has selected dark mode either in the app or on their operating system.
   */
  srcDark?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const imageStyles = css({
  maxWidth: '100%',
  height: 'auto',
});

/**
 * __Image__
 *
 * This component can be used interchangeably with the native `img` element. It includes additional functionality, such as theme support.
 *
 * - [Examples](https://atlassian.design/components/image/examples)
 * - [Code](https://atlassian.design/components/image/code)
 * - [Usage](https://atlassian.design/components/image/usage)
 */
export default function Image({
  src,
  srcDark,
  alt,
  testId,
  ...props
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [colorMode, setColorMode] = useState('');
  const theme = useThemeObserver();

  useEffect(() => {
    if (imgRef === null || imgRef.current === null) {
      return;
    }

    if (srcDark && theme === 'dark') {
      imgRef.current.src = srcDark;
    } else if (src) {
      imgRef.current.src = src;
    }
  }, [src, srcDark, theme]);

  /**
   * TODO: Remove the following once useThemeObserver reports `color-mode`
   */
  useEffect(() => {
    setColorMode(
      document.documentElement.getAttribute('data-color-mode') || '',
    );
  }, [theme, setColorMode]);

  return (
    <picture>
      {srcDark && colorMode === 'auto' && (
        <source srcSet={srcDark} media="(prefers-color-scheme: dark)" />
      )}
      <img
        alt={alt}
        css={imageStyles}
        data-testid={testId}
        src={src}
        ref={imgRef}
        // The spread operator is necessary since the component can accept all the props of an `img` element.
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...props}
      />
    </picture>
  );
}
