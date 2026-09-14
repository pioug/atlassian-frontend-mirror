# Disallow Native Embed bridge query parameter literals

The Native Embeds iframe integration owns this private bridge query parameter protocol. Other
packages must not duplicate its parameter names because doing so can attach a second bridge
lifecycle to an existing client ID. Marking that shared client ready can then drain queued commands
before content-specific handlers are registered.

There is deliberately no new public helper for reproducing this behavior. Consumers should use an
existing Native Embeds integration or coordinate with the Native Embeds owners instead of copying
the protocol.

The temporary Smart Creation usage is grandfathered until CNS-35670 removes it. Tests and examples
are also excluded so they can assert or demonstrate the wire protocol directly.

The protocol keys, allowlist, and rule implementation live in `@atlassian/native-embeds-core`. This
plugin re-exports and enables the rule so Native Embeds remains the owner of its constraints while
AFM enforces them across the monorepo.
