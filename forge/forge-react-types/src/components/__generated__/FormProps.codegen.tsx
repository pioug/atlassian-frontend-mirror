/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::7b259a0bfc883f09eb65cdccee169a6a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::0e0a2f1184da9df422fb61ff7d906158>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ReactNode } from 'react';

export type FormProps = {
	onSubmit: () => Promise<void | boolean> | void;
	children: ReactNode;
};

export type TForm<T> = (props: FormProps) => T;