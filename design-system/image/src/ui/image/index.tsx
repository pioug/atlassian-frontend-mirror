/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { UNSAFE_useColorModeForMigration } from '@atlaskit/app-provider';
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

const baseImageStyles = css({
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
export default function Image({ src, srcDark, alt, testId, className, ...props }: ImageProps) {
	const imgRef = useRef<HTMLImageElement>(null);
	const providedColorMode = UNSAFE_useColorModeForMigration();
	const { colorMode: observedColorMode } = useThemeObserver();
	const colorMode = providedColorMode || observedColorMode;

	useEffect(() => {
		if (imgRef === null || imgRef.current === null) {
			return;
		}

		if (srcDark && colorMode === 'dark') {
			imgRef.current.src = srcDark;
		} else if (src) {
			imgRef.current.src = src;
		}
	}, [src, srcDark, colorMode]);

	return (
		<img
			alt={alt}
			data-testid={testId}
			src={src}
			css={baseImageStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			ref={imgRef}
			// The spread operator is necessary since the component can accept all the props of an `img` element.
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
}
