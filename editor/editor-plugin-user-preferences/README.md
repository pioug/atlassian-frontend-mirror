# Editor Plugin User Preferences

User Preferences plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The User Preferences plugin provides comprehensive user preference management capabilities for the Atlassian Editor. It integrates with a UserPreferencesProvider to capture, persist, and manage user preferences across editor sessions. The plugin supports preference updates, retrieval, and automatic synchronization with the editor state.

## Key features

- **Preference management** - Get and update user preferences with a consistent API
- **Persistent storage** - Optional integration with UserPreferencesProvider for preference persistence
- **In-memory mode** - Operates without a provider when persistence is not available
- **Event tracking** - Integration with analytics plugin for preference update tracking
- **Hooks integration** - React hooks for listening to preference changes and document visibility
- **Flexible configuration** - Configure initial preferences and provide a custom preferences provider

## Install

---

- **Install** - *yarn add @atlaskit/editor-plugin-user-preferences*
- **npm** - [@atlaskit/editor-plugin-user-preferences](https://www.npmjs.com/package/@atlaskit/editor-plugin-user-preferences)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-user-preferences)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-user-preferences/dist/)

## Usage

---

**Internal use only**

@atlaskit/editor-plugin-user-preferences is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin user preferences](https://atlaskit.atlassian.com/packages/editor/editor-plugin-user-preferences) for documentation and examples for this package.

## Support

---

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

---

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
