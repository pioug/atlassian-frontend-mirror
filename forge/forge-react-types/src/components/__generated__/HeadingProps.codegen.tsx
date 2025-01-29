/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::f5b58f64c5c8cfbaff45b7d288ec4ffd>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::b9f5a7af9c404be1b3bf1e55075715fc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TemporaryColors = 'default' | 'inverse';
type NewColors = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

export type HeadingProps = Pick<PlatformHeadingProps, 'children' | 'id' | 'testId'> & {
	as: HeadingTags;
	color?: NewColors | TemporaryColors;
};

/**
 * A heading is a typography component used to display text in different sizes and formats.
 */
export type THeading<T> = (props: HeadingProps) => T;