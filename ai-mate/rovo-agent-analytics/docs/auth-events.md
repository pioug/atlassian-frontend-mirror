# Auth event migration

The shared `ThirdPartyAppsSection` emits auth events through `useRovoAgentActionAnalytics` on every
host surface. Hosts should remove their auth event emitters to avoid duplicate events. Events carry
`agentId`, `agentMode`, `agentVersionType`, `touchPoint`, `mcpServerAri`, `productName` and
`wasAuthenticated`. Access uses `LIVE` for published agents and `DRAFT` for unpublished agents;
trigger surfaces use the displayed agent version. Consent URLs, connection account IDs and external
account labels are excluded.

The legacy Access page events below are deprecated and no longer emitted by that page:

| Legacy event                                                     | Replacement action                     | Action subject   |
| ---------------------------------------------------------------- | -------------------------------------- | ---------------- |
| `thirdPartyConnection connected`                                 | `thirdPartyConnectionConnected`        | `rovoAgent`      |
| `thirdPartyConnection connectFailed` with `errorType: cancelled` | `thirdPartyConnectionConnectCancelled` | `rovoAgent`      |
| `thirdPartyConnection connectFailed` with `errorType: failed`    | `thirdPartyConnectionConnectFailed`    | `rovoAgentError` |

Consent success is recorded before refetching readiness. A later refetch failure emits
`thirdPartyConnectionReadinessRefreshFailed` with action subject `rovoAgentError`, rather than
reporting a failed consent. Cancellation remains silent in the UI. Error events follow the library's
`error: { message }` contract. Dashboards consuming the legacy events need to migrate to these
actions and use `touchPoint` to distinguish Access, trigger editing and profile connections.
