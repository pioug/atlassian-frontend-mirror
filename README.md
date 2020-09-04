# Atlaskit

## Get started

Atlaskit is a collection of reusable React UI components designed for Atlassian products and experiences.

As of January 2020, the repository for Atlaskit was made private to support the inclusion of Atlassian’s private front-end code. Not to worry though, our public libraries such as _Atlassian Design System_, _Atlassian Editor_, and _Atlassian Media_ are still available for use via [npm](https://www.npmjs.com/org/atlaskit).

### For Atlassian developers

If you’re looking to contribute, head over to [Atlassian Frontend Guides🔒](https://developer.atlassian.com/cloud/framework/atlassian-frontend/) to get started.

### For community developers

To view the source of public libraries, please visit the public mirror: [atlassian/design-system-mirror](https://bitbucket.org/atlassian/design-system-mirror/src). Currently, it is a one-way mirror of the packages that are exposed externally. If you are looking to contribute back, this currently isn't supported.

If you need to report a bug or suggest a feature, please start a discussion thread on the [Atlassian Developer Community forums (in the Ecosystem Design category)](https://community.developer.atlassian.com/c/atlassian-ecosystem-design), for all issues whether related to Design System, Editor, or Media components. We will monitor the forums and ensure they are addressed by the appropriate maintainers. (Note that this is different from the Design System-specific service desk that we have previously used).

## Installation and usage

Atlaskit components and utilities are available as individual [npm](https://www.npmjs.com/org/atlaskit) packages. This allows users to consume a subset of components as needed, without needing to install the entire library. However, there are some prerequisites to be aware of to ensure all components behave as expected.

### Prerequisites

#### Peer dependencies

For components to work correctly, please include the following dependencies in your application:

```js
"react": "^16.8.0",
"styled-components": "^3.2.6"
```

#### CSS reset

It's strongly advised to use the CSS reset in your project, or some components may diverge in appearance:

```js
import '@atlaskit/css-reset';
```

#### Polyfills

Components in this repo assume the following polyfills (or equivalent) are available:

```js
require('whatwg-fetch');
require('core-js/es6');
require('core-js/es7');
require('core-js/modules/web.timers');
require('core-js/modules/web.immediate');
require('core-js/modules/web.dom.iterable');
require('regenerator-runtime/runtime');
```

#### Example for React projects

The components are built for React. The following is an example of using the [Avatar component](https://www.atlassian.design/components/avatar):

- Specify the Avatar component in your project as a dependency using npm: `npm install @atlaskit/avatar`

- Use it in your React projects as follows:

```js
import React from 'react';
import Avatar from '@atlaskit/avatar';

export default (
  <Avatar
    src="https://design.atlassian.com/images/avatars/project-128.png"
    size="large"
  />
);
```

### Documentation

A comprehensive list of components can be found in [Packages](https://atlaskit.atlassian.com/packages), which contains documentation for each component as well as examples, best practices, usage guidelines, and API definitions.

### Changelogs

Changelogs are how we communicate new changes with our users. They are regularly published and made available for every component. Here you can find out about new features, bug fixes, migration guides, etc. (For example, [view the Avatar changelog](https://www.atlassian.design/components/avatar/code#changelog)).

If you have questions or issues about upgrading to a new version, it’s best to read the changelog for that component first, before raising an issue.

### License

Atlaskit is a [mono-repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), which means that different parts of this repository can have different licenses.

The base level of the repository is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0). There are separate license files for each component that specifies the license restrictions. (For example, [view the Avatar license](https://bitbucket.org/atlassian/design-system-mirror/src/master/design-system/avatar/LICENSE)).

Please note that packages containing styles, assets, and icons are most likely licensed under the [Atlassian Design Guidelines license](https://www.atlassian.design/license). (For example, [view the Icon license](https://bitbucket.org/atlassian/design-system-mirror/src/master/design-system/icon/LICENSE)).

If you fork this repository, you can continue to use Atlassian Design Guidelines licensed components only under the given license restrictions. If you want to redistribute this repository, you will need to replace these Atlassian Design Guidelines licensed components with your own implementation.

Copyright © 2020 Atlassian.
