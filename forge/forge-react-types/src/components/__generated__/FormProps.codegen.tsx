/* eslint-disable @repo/internal/codegen/signed-source-integrity */
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::e4fd98e34e924eedd46c404a7f1cb53e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::0799b151ffba2039603ebfc2a56c8794>>
 */
import type { ReactNode } from 'react';

export type FormProps = {
	onSubmit: () => void;
	children: ReactNode;
};
