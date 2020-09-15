import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

${(
  <SectionMessage appearance="warning" title="Note">
    onLeftSidebarExpand and onLeftSidebarCollapse will be triggered in tests
    only if transitionEnd event is called manually.
  </SectionMessage>
)}

## Documentation

  Extra documentation can be found in the **sidebar nav links** 👈
  - [Skip Links](page-layout/docs/skip-links)
  - [CSS variables](page-layout/docs/css-variables)

## Usage

${code`import {
  PageLayout,
  Main,
  Content,
  RightSidebar,
  LeftSidebar,
  LeftSidebarWithoutResize,
  RightPanel,
  LeftPanel,
  Banner,
  TopNavigation
} from '@atlaskit/page-layout';`}

## Page-layout

Page layout refers to the arrangement of text, images, and other objects on a page.

${(
  <Example
    packageName="@atlaskit/page-layout"
    Component={require('../examples/01-basic-page-layout').default}
    title="Basic page-layout"
    source={require('!!raw-loader!../examples/01-basic-page-layout')}
  />
)}


${(
  <Props
    heading="Page-layout Props"
    props={require('!!extract-react-types-loader!../src/components/slots/page-layout')}
  />
)}

## Main
It shows the main content of the page.

${(
  <Props
    heading="Main Props"
    props={require('!!extract-react-types-loader!../src/components/slots/main')}
  />
)}

## Content
Shows some the content.

${(
  <Props
    heading="content Props"
    props={require('!!extract-react-types-loader!../src/components/slots/content')}
  />
)}

## Right-sidebar
It typically appears as a column to the right of the main content.

${(
  <Props
    heading="Right-sidebar Props"
    props={require('!!extract-react-types-loader!../src/components/slots/right-sidebar')}
  />
)}

## Left-sidebar
It typically appears as a column to the left of the main content.

${(
  <Props
    heading="Left-sidebar Props"
    props={require('!!extract-react-types-loader!../src/components/slots/left-sidebar')}
  />
)}

## Left-sidebar-without-resize
It typically appears as a column to the left of the main content and it doesn't have resize functionality.

${(
  <Props
    heading="Left-sidebar Props"
    props={require('!!extract-react-types-loader!../src/components/slots/left-sidebar-without-resize')}
  />
)}

## Right-panel
Right-panel appears in the right side of the window.

${(
  <Props
    heading="Right-panel Props"
    props={require('!!extract-react-types-loader!../src/components/slots/right-panel')}
  />
)}

## Left-panel
Left-panel appears in the left side of the window.

${(
  <Props
    heading="Left-panel Props"
    props={require('!!extract-react-types-loader!../src/components/slots/left-panel')}
  />
)}

## Banner
A banner displays a prominent message at the top of the screen.

${(
  <Props
    heading="Banner Props"
    props={require('!!extract-react-types-loader!../src/components/slots/banner')}
  />
)}

## Top-navigation
It may be below the header or logo, but it is always placed before the main content of the page.
In some cases, it may make sense to place the navigation bar vertically on the left side of each page.

${(
  <Props
    heading="Top-navigation Props"
    props={require('!!extract-react-types-loader!../src/components/slots/top-navigation')}
  />
)}

`;
