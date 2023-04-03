import type { EditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorProps } from '../types/editor-props';

const EMPTY: EditorPlugin[] = [];
export function shouldRecreatePreset(
  props: EditorProps,
  nextProps: EditorProps,
) {
  const prevPlugins = props.dangerouslyAppendPlugins?.__plugins ?? EMPTY;
  const nextPlugins = nextProps.dangerouslyAppendPlugins?.__plugins ?? EMPTY;

  if (
    nextPlugins.length !== prevPlugins.length ||
    prevPlugins.some((p) =>
      nextPlugins.some((n) => n.name === p.name && n !== p),
    )
  ) {
    return true;
  }

  return shouldReconfigureState(props, nextProps);
}

function shouldReconfigureState(props: EditorProps, nextProps: EditorProps) {
  const mobileProperties: Array<keyof EditorProps> =
    props.appearance === 'mobile' ? ['quickInsert', 'featureFlags'] : [];

  const properties: Array<keyof EditorProps> = [
    'appearance',
    'persistScrollGutter',
    'allowUndoRedoButtons',
    'placeholder',
    'sanitizePrivateContent',
    ...mobileProperties,
  ];

  return properties.reduce(
    (acc, curr) => acc || props[curr] !== nextProps[curr],
    false,
  );
}
