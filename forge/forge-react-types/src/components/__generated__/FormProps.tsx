/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::907c2307d88c09c5afb44ad749dfc496>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/index.tsx <<SignedSource::6d4d25db5b3185c05c0f48ce5c0c860c>>
 */
import type { ReactNode } from 'react';

export type FormProps = {
  onSubmit: () => void;
  children: ReactNode;
};