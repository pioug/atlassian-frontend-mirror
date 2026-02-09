# Editor Plugin Analytics

Analytics plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Analytics plugin provides comprehensive event tracking and performance monitoring capabilities for the Atlassian Editor. It integrates with `@atlaskit/analytics-next` to capture, process, and dispatch analytics events during editor operations.

## Key features

- **Event tracking** - Capture and track editor actions and state changes
- **Performance monitoring** - Measure render performance and DOM update timings
- **Event queuing** - Queue analytics events when dependencies are not yet available
- **Flexible configuration** - Configure analytics event creation and performance tracking options
- **Transaction integration** - Attach analytics payloads directly to ProseMirror transactions

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-analytics*
- **npm** - [@atlaskit/editor-plugin-analytics](https://www.npmjs.com/package/@atlaskit/editor-plugin-analytics)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-analytics)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-analytics/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-analytics is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin analytics](https://atlaskit.atlassian.com/packages/editor/editor-plugin-analytics) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.