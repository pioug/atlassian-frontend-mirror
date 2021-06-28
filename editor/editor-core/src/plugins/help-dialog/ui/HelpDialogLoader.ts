import Loadable from 'react-loadable';
import type { Props as HelpDialogProps } from './index';

export const HelpDialogLoader = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-core-helpdialog" */
      './index'
    ).then((mod) => mod.default) as Promise<
      React.ComponentType<HelpDialogProps>
    >,
  loading: () => null,
});
