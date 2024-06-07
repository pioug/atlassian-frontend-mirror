/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::60c6f9204123afe2dc47c6bd0bf1bcfe>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/index.tsx <<SignedSource::0799b151ffba2039603ebfc2a56c8794>>
 */
import type { ReactNode } from 'react';

export type FormProps = {
	onSubmit: () => void;
	children: ReactNode;
};