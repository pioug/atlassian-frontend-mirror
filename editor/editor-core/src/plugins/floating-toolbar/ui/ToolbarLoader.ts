import Loadable from 'react-loadable';

export const ToolbarLoader = Loadable({
  loader: () =>
    import(
      /* webpackChunkName:"@atlaskit-internal-editor-core-floating-toolbar" */
      './Toolbar'
    ),
  loading: () => null,
});
