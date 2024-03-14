/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormProps
 *
 * @codegen <<SignedSource::7c9522c55d4584b6a3d4cc6e9366fd61>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/index.tsx <<SignedSource::c7d435cba1e3502a0d409b3723afeece>>
 */
import type { ReactNode } from 'react';

export type FormProps = {
  onSubmit: () => void;
  children: ReactNode;
};