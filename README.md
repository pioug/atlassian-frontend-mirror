# Atlassian Frontend Mirror

This public repository contains a collection of reusable packages designed for Atlassian products and experiences, [mirrored from our internal repository](https://bitbucket.org/atlassian/atlassian-frontend).

[Browse packages →](https://atlaskit.atlassian.com/packages/)

## Installation

All packages in this repository are available as [individual npm packages](https://www.npmjs.com/org/atlaskit).

### Prerequisites

#### Peer dependencies

Packages in this repository can have peer dependencies. When installing a package make sure to have these installed first:

```
npm i react@^16.8 react-dom@^16.8 styled-components@^3.2
```

Packages related to Editor and Media can also have a peer dependency on react-intl. If using an Editor or Media package, make sure to install this peer dependency:

```
npm i react-intl@^2.6
```

Since these are all peer dependencies, they need to be on the specified major version. Undefined behavior may occur when trying to use these peer dependencies on different major versions.

#### CSS reset

Some packages need this reset to ensure styles are rendered consistently as undefined behavior can happen without it:

```
npm i @atlaskit/css-reset
```
For setup instructions please [view the CSS reset documentation](https://atlaskit.atlassian.com/packages/css-packs/css-reset).

### Usage

Install packages you’re interested in using, for example, a button:

```
npm i @atlaskit/button
```

```
import Button from '@atlaskit/button';

<Button>Hello world!</Button>
```

### Browser support

Atlassian Frontend supports all [supported browsers for Atlassian cloud products](https://confluence.atlassian.com/cloud/supported-browsers-744721663.html).


|          ![chrome](imgs/chrome.png)          |        ![safari](imgs/safari.png)        | ![firefox](imgs/firefox.png) | ![edge](imgs/edge.png) |
|:--------------------------------------------:|:----------------------------------------:|:----------------------------:|:----------------------:|
| Latest ✔<br>Latest Android ✔<br>Latest iOS ✔ | Latest on latest macOS ✔<br>Latest iOS ✔ |           Latest ✔           |        Latest ✔        |

### Contributing

Currently, Atlassian Frontend is only accepting contributions from Atlassian employees. If you are an Atlassian employee you can [find information about this on our internal docs](https://developer.atlassian.com/cloud/framework/atlassian-frontend/).

### Support

For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design). The forums are monitored and posts will be directed to the appropriate maintainers. We offer support for components that are part of the `Atlassian Design System` (which corresponds to the `/design-system` folder in the repository).

Please note that the level of support varies for all other packages. They are owned by different teams within Atlassian and are primarily intended for internal use. We will monitor the forums and try our best to redirect topics to the appropriate maintainers, but some packages are made available without official support.

### License

This repository is a monorepo, which means that different parts of this repository can have different licenses.

The base level of the repository is licensed under [Apache 2.0](https://developer.atlassian.com/cloud/framework/atlassian-frontend/LICENSE). There are separate license files for each package that specifies the license restrictions. (For example, view the [Avatar license](https://bitbucket.org/atlassian/design-system-mirror/src/master/design-system/avatar/LICENSE)).

If you fork this repository, you can continue to use Atlassian Design Guidelines licensed packages only under the given license restrictions. If you want to redistribute this repository, you will need to replace these Atlassian Design Guidelines licensed packages with your own implementation.

Copyright © 2020 Atlassian

---

![cheers](imgs/cheers.png)

This is a mirror of all public @atlaskit scoped packages from Atlassian Frontend. No issues, commits, or pull requests can be made to this repository at this time.
