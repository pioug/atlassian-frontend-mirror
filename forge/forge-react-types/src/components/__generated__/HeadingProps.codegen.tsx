/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::2c8b9fcedd66187121afe603412e469a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/heading/__generated__/index.partial.tsx <<SignedSource::982b85018ea081e37c5f877b1b2767d5>>
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