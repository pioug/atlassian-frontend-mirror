import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export interface ReactNodeProps {
  selected: boolean;
}

export type ProsemirrorGetPosHandler = () => number | undefined;
export type getPosHandler = getPosHandlerNode | boolean;
export type getPosHandlerNode = () => number | undefined;
export type ReactComponentProps = { [key: string]: unknown };
export type ForwardRef = (node: HTMLElement | null) => void;
export type shouldUpdate = (nextNode: PMNode) => boolean;
