import React from 'react';
import Loadable from 'react-loadable';
import styled from 'styled-components';

import Spinner from '@atlaskit/spinner';
import type { Props as ElementBrowserProps } from '../ElementBrowser';

const SpinnerContainer = styled.div`
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
    <SpinnerContainer>
      <Spinner size="medium" />
    </SpinnerContainer>
  ),
});

export default ElementBrowserLoader;
