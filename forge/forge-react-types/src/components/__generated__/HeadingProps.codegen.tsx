/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::8ab3b3f5dd85c2eff37cf908d6e693ba>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::b40904da638774634ed529b90c13d99d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

type Sizes = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';

// Serialized type
type PlatformHeadingProps = {
  /**
	 * Allows the component to be rendered as the specified DOM element, overriding a default element set by `level` prop.
	 */
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  /**
	 * Token representing text color with a built-in fallback value.
	 * Will apply inverse text color automatically if placed within a Box with bold background color.
	 * Defaults to `color.text`.
	 */
	color?: 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';
  /**
	 * The text of the heading.
	 */
	children: React.ReactNode;
  /**
	 * Unique identifier for the heading DOM element.
	 */
	id?: string;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};

export type HeadingProps = Pick<
	PlatformHeadingProps,
	'children' | 'id' | 'testId' | 'as' | 'color'
> & {
	size?: Sizes;
};

/**
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @see [Heading](https://developer.atlassian.com/platform/forge/ui-kit/components/heading/) in UI Kit documentation for more information
 */
export type THeading<T> = (props: HeadingProps) => T;