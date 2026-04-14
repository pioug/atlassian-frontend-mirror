# Editor Plugin Fragment

Fragment plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Fragment plugin enables support for fragment marks in the Atlassian Editor. It manages fragment consistency and provides ProseMirror integration for handling fragment-based content within editor documents.

## Key features

- **Fragment mark support** - Add and manage fragment marks in the editor
- **Fragment consistency** - Ensures fragment marks remain consistent during document edits
- **ProseMirror integration** - Seamless integration with ProseMirror plugin architecture

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-fragment*
- **npm** - [@atlaskit/editor-plugin-fragment](https://www.npmjs.com/package/@atlaskit/editor-plugin-fragment)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-fragment)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-fragment/dist/)

## Usage
---

```javascript
import { fragmentPlugin } from '@atlaskit/editor-plugin-fragment';
```

@atlaskit/editor-plugin-fragment is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin fragment](https://atlaskit.atlassian.com/packages/editor/editor-plugin-fragment) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
