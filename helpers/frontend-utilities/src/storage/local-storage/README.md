# Local Storage mock

> Basic mock and window attachment for LocalStorage for environments that may not have it

### Team
**Activity Platform / Recent Work**

**Slack**: #rw-team

## Instructions

`import { STORAGE_MOCK, mockWindowStorage } from "@atlaskit/frontend-utilities/local-storage";`

### `STORAGE_MOCK`

This is the basic mock object.

### `mockWindowStorage`

Calling this function will attach a new copy of `STORAGE_MOCK` to either `window.localStorage`,`window.sessionStorage` or both.

#### Usage

`mockWindowStorage()`
