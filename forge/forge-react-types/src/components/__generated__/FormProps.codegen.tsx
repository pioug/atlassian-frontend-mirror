/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::dea38cc30d6c9b3c90a177c2653326bf>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/index.tsx <<SignedSource::8609216439e3924527aacde2ec0cef97>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ReactNode } from 'react';

export type FormProps = {
	onSubmit: () => void | boolean;
	children: ReactNode;
};

export type TForm<T> = (props: FormProps) => T;