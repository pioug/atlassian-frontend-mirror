/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::0edc0326125b06e6a1280e81282d048d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::c7fa27d57c7e5695728bcfa2ffa634f9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type Sizes = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';

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