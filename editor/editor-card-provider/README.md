# @atlaskit/editor-card-provider
This package is designed to be used with the editor.

## Usage

```Typescript
import { EditorCardProvider } from '@atlaskit/editor-card-provider'

// Default usage
const provider = new EditorCardProvider('stg');

// You may also pass in a base url override, if you'd like EditorCardProvider
// to make requests other than api-private.atlassian.com (prod) or pug.jira-dev.com (stg)
const provider = new EditorCardProvider('stg', 'www.acme.com/your-api-here');

```
