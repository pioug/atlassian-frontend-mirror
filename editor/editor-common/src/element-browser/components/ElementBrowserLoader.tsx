/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import Loadable from 'react-loadable';

import Spinner from '@atlaskit/spinner';

import type { Props as ElementBrowserProps } from '../ElementBrowser';

const spinnerContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ElementBrowserLoader = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-element-browser" */ '../ElementBrowser'
    ).then((module) => module.default) as Promise<
      React.ComponentType<ElementBrowserProps>
    >,
  loading: () => (
    <div css={spinnerContainer}>
      <Spinner size="medium" />
    </div>
  ),
});

export default ElementBrowserLoader;
