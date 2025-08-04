/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::6e4d86411f309fc163a056ae74e29468>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::c2e393842de2c8b997b63888ed720646>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';

export type PlatformHeadingProps = Omit<_PlatformHeadingProps, 'size'> & {
	size?: Sizes;
}
type Sizes = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';

// Serialized type
type _PlatformHeadingProps = {
  
	size?: 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';
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
  'size' | 'color' | 'as' | 'children' | 'id' | 'testId'
>;

/**
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @see [Heading](https://developer.atlassian.com/platform/forge/ui-kit/components/heading/) in UI Kit documentation for more information
 */
export type THeading<T> = (props: HeadingProps) => T;