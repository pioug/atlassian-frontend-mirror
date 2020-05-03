import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

${(
  <SectionMessage
    appearance="warning"
    title="Moving to a new navigation experience."
  >
    <p>
      Atlassian is moving to a new navigation experience, which includes
      horizontal global navigation, and re-built navigation components to
      replace navigation-next.
    </p>
    <p>
      If you are building a new navigation experience, please use{' '}
      <a href="../navigation/atlassian-navigation">
        @atlaskit/atlassian-navigation
      </a>{' '}
      {', '}
      <a href="../navigation/side-navigation">@atlaskit/side-navigation</a>
      {' and '}
      <a href="./page-layout">@atlaskit/page-layout</a>.
    </p>
    <p>
      {' '}
      For a guide on how to upgrade from `navigation-next` to the new navigation
      components, follow{' '}
      <a href="../navigation/atlassian-navigation/docs/migrating-from-navigation-next">
        this guide in the atlassian-navigation docs
      </a>
      .
    </p>
  </SectionMessage>
)}

## Documentation

#### 📦 [UI components](/packages/design-system/navigation-next/docs/ui-components)

Props documentation for all of the components exported by \`navigation-next\`.

#### 🧠 [State controllers](/packages/design-system/navigation-next/docs/state-controllers)

API reference for the UI and View state containers.

## Guides

#### 🗺 [Composing your navigation](/packages/design-system/navigation-next/docs/composing-your-navigation)

This guide is a great place to start if you haven't used the library before. It will introduce you to many of the components exported by \`navigation-next\`, and will walk you through composing a simple navigation.

#### 🌏 [Controlling navigation views](/packages/design-system/navigation-next/docs/controlling-navigation-views)

If you're wondering how to manage the state of your navigation, this guide is for you. It will introduce you to some of the more advanced concepts in \`navigation-next\`.

#### 🍰 [Code Splitting & Component Entrypoints](/packages/design-system/navigation-next/docs/code-splitting-and-component-entrypoints)

If you are having problems with bundle size or/and performance on your pages, this guide is for you. It will introduce the concept of entrypoints and how to have benefits using that on \`navigation-next\`.

#### 🛠 [Upgrade guide](/packages/design-system/navigation-next/docs/upgrade-guide)

View this guide to help upgrade breaking changes between major versions of navigation-next.
`;
