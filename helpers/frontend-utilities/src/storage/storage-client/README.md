# Storage Client

> Storage layer with inbuilt expiry control, exception capturing and mocking

### Team

**Activity Platform / Recent Work**

**Slack**: #rw-team

## Instructions

`import { StorageClient } from "@atlaskit/frontend-utilities/storage-client";`

### StorageClient

A lightweight wrapper around `localStorage / sessionStorage` that will mock the engine if
unavailable, with the ability to provide an exception handler as expiry times for individual items.

#### Usage

```ts
const storageClient = new StorageClient(STORAGE_KEY, handlers);

storageClient.setItemWithExpiry('key', { test: true });
storageClient.setItemWithExpiry('expires-key', { test: true }, 1000);

storageClient.getItem('key');
storageClient.getItem('expires-key', { clearExpiredItem: false, useExpiredItem: false });
```
