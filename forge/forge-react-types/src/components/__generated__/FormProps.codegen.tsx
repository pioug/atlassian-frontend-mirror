/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::090d27d13d3501730a8a468864818a17>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::4e22f44554236bb94cd211c5a4fec470>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ReactNode } from 'react';

export type FormProps = {
	onSubmit: () => void;
	children: ReactNode;
};