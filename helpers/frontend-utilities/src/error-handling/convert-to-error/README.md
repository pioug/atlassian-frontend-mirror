# Convert to Error

> This is a small utility to convert an unknown type into an instance of an Error

### Team
**Activity Platform / Recent Work**

**Slack**: #rw-team

## Instructions

`import { convertToError } from "@atlaskit/frontend-utilities/convert-to-error";`

### convertToError

Convert an unknown type into an instance of the Error class

#### Usage

```ts
try {
    // do something
}
catch (e: unknown) {
  const error: Error = convertToError(e);   
}
```
