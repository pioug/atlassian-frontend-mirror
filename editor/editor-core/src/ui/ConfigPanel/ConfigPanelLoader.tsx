import Loadable from 'react-loadable';
import LoadingState from './LoadingState';
import { PublicProps } from './types';

export default Loadable<PublicProps, any>({
  loader: () =>
    import(
      /* webpackChunkName:"@atlaskit-internal-editor-core-config-panel" */
      './FieldsLoader'
    ).then(module => module.default),
  loading: LoadingState,
});
