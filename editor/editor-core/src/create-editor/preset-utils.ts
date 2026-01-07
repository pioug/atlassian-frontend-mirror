import type { EditorProps } from '../types/editor-props';

export function shouldRecreatePreset(props: EditorProps, nextProps: EditorProps): boolean {
	const properties: Array<keyof EditorProps> = [
		'appearance',
		'persistScrollGutter',
		'allowUndoRedoButtons',
		'placeholder',
		'sanitizePrivateContent',
	];

	return properties.reduce((acc, curr) => acc || props[curr] !== nextProps[curr], false);
}
