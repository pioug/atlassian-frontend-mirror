import type { Props } from '../../ui/Renderer';

export type RendererPropsOverrides = { [T in keyof Props]?: Props[T] } & {
  showSidebar?: boolean;
  withRendererActions?: boolean;
  mockInlineComments?: boolean;
};
