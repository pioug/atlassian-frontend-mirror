import { Node as PMNode } from 'prosemirror-model';

export interface ReactNodeProps {
  selected: boolean;
}

export type ProsemirrorGetPosHandler = () => number;
export type getPosHandler = getPosHandlerNode | boolean;
export type getPosHandlerNode = () => number;
export type ReactComponentProps = { [key: string]: unknown };
export type ForwardRef = (node: HTMLElement | null) => void;
export type shouldUpdate = (nextNode: PMNode) => boolean;
