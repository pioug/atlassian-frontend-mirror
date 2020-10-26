import Loadable from 'react-loadable';
import LoadingState from './LoadingState';
import type { PublicProps } from './FieldsLoader';

export default Loadable<PublicProps, any>({
  loader: () =>
    import(
      /* webpackChunkName:"@atlaskit-internal-editor-core-config-panel" */
      './FieldsLoader'
    ).then(module => module.default),
  loading: LoadingState,
});
