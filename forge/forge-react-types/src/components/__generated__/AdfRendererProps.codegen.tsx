/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - AdfRendererProps
 *
 * @codegen <<SignedSource::4df2177e43ce459eb2e5e90a45b6ae46>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/adfrenderer/index.tsx <<SignedSource::cdc7d14a5256e848ce024721e5383e71>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import { type RendererProps } from '@atlaskit/renderer';

export type AdfRendererProps = RendererProps & {
	documentWithoutMedia?: RendererProps['document'];
};