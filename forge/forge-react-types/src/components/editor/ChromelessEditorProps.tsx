import type { EditorProps } from './types';

export type ChromelessEditorProps = EditorProps;

/**
 * The chromeless editor provides the Editor without any of the standard UI features. It's ideal for cases where the integrator wants complete control and responsibility over the editor UI.
 *
 * @see [ChromelessEditor](https://developer.atlassian.com/platform/forge/ui-kit/components/chromeless-editor/) in UI Kit documentation for more information
 */
export type TChromelessEditor<T> = (props: ChromelessEditorProps) => T;
