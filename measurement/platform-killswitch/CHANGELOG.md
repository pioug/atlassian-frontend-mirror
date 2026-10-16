# @atlaskit/platform-killswitch

## 0.1.0

### Minor Changes

- [`d96e7148da4f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d96e7148da4f2) -
  Add a shared case-insensitive killswitch helper backed by `killswitch.value`, without experiment
  exposures. Replace Relay's `hot-302159-relay-get-killswitch` gate with the named
  `relay-get-queries` killswitch.

  Wait for SDK initialization before reading the config, then reuse the cached names without further
  SDK reads.

  Update the `@atlassian/conversation-assistant` example GraphQL mock to accept Relay GET queries as
  well as POST requests.
