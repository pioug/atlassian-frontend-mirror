import Loadable from 'react-loadable';
import type { Props } from './Toolbar';

export const ToolbarLoader = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-core-floating-toolbar" */
      './Toolbar'
    ).then((mod) => mod.default) as Promise<React.ComponentType<Props>>,
  loading: () => null,
});
