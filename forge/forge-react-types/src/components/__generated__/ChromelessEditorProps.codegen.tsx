/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ChromelessEditorProps
 *
 * @codegen <<SignedSource::04d9931dadacdce6d3bc5506646d3402>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/editor/chromeless-editor/index.tsx <<SignedSource::acc04099c3230f374e4e22e03d443e0e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { EditorProps } from './types.codegen';

export type ChromelessEditorProps = EditorProps;

/**
 * The chromeless editor provides the Editor without any of the standard UI features. It's ideal for cases where the integrator wants complete control and responsibility over the editor UI.
 *
 * @see [ChromelessEditor](https://developer.atlassian.com/platform/forge/ui-kit/components/chromeless-editor/) in UI Kit documentation for more information
 */
export type TChromelessEditor<T> = (props: ChromelessEditorProps) => T;