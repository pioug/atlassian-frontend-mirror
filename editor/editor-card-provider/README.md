# @atlaskit/editor-card-provider

Contains the EditorCardProvider, for determining smart card behaviour in the editor.

## Description

This package provides the EditorCardProvider class, which is designed to be used with the editor to determine smart card behavior. It manages smart card interactions, transformations, and API communications for link resolution and card rendering within the editor context.

## Key Features

### Provider
- **EditorCardProvider**: Main provider class for smart card behavior management
- **Environment Support**: Supports different environments (staging, production) with configurable base URLs
- **API Integration**: Handles API requests for card data and transformations

### Core Functionality
- **Card Data Management**: Fetches and manages smart card data
- **Link Resolution**: Resolves URLs to smart card representations
- **Transformations**: Handles data transformations for editor integration
- **Feature Flag Integration**: Supports platform feature flags for conditional behavior

## Usage

```typescript
import { EditorCardProvider } from '@atlaskit/editor-card-provider';

// Default usage
const provider = new EditorCardProvider('stg');

// You may also pass in a base url override, if you'd like EditorCardProvider
// to make requests other than api-private.atlassian.com (prod) or pug.jira-dev.com (stg)
const provider = new EditorCardProvider('stg', 'www.acme.com/your-api-here');
```

## Team

**Editor: Lego**
