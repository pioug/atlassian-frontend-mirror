/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::c2e29c89ead70009a792cea03271e9c4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::96b99b296364dce930bb91174b226eaa>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type Sizes = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';
type TemporaryColors = 'default' | 'inverse';
type NewColors = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

export type HeadingProps = Pick<PlatformHeadingProps, 'children' | 'id' | 'testId' | 'as'> & {
	size?: Sizes;
	color?: NewColors | TemporaryColors;
};

/**
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @see [Heading](https://developer.atlassian.com/platform/forge/ui-kit/components/heading/) in UI Kit documentation for more information
 */
export type THeading<T> = (props: HeadingProps) => T;