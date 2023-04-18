# 2. Deep equality check for getSharedState

Date: 2023-03-17

## Status

Accepted

## Context

via @Rodrigo Vieira https://atlassian.slack.com/archives/C046RBH9HT5/p1679018928924739

People, we have a optimisation situation with the getSharedState.

Right now, it is expect to be a pure function, That means return the same value for the same input, but you could do something like that

```ts
getSharedState(editorState) {
  if (isDocumentEmpty(editorState) ) {
    return {
      isDocEmpty: true,
    };
  }

  return {
      isDocEmpty: false,
  };
}
```

Right we are doing a shallow check before call the onChange listeners:

```ts
// Dumb check - should we do a deepcheck?
if (isInitialization || prevSharedState !== nextSharedState) {
  (listeners.get(pluginName) || new Set<Callback>()).forEach((callback) => {
    callbacks.push(
      callback.bind(callback, { nextSharedState, prevSharedState }),
    );
  });
}
```

As expected, we need to improve it.

We have two possible approaches

1. Do the same as ProseMirror does
2. Do a deep check

### Same as ProseMirror does

We can give the last shared state to the getSharedState and the dev would be responsible to return the same object in case there is no change

### Do a deep check

We can use something like `isEqual` and let dev do whatever they want to

## Decision

Use a deep check.

See https://bitbucket.org/%7B%7D/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/31238

## Consequences

Slight additional performance cost incurred, trading off for safety against plugins having to do the deep check itself.
