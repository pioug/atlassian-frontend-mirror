import Loadable from 'react-loadable';
import LoadingState from './LoadingState';
import type { PublicProps } from './ConfigPanelFieldsLoader';

export default Loadable<PublicProps, any>({
  loader: () =>
    import(
      /* webpackChunkName:"@atlaskit-internal-editor-core-config-panel" */
      './ConfigPanelFieldsLoader'
    ).then(module => module.default),
  loading: LoadingState,
});
