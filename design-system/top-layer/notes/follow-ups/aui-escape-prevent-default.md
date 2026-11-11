# Follow-up: AUI Escape cancellation

**Status:** Initial patch implemented in
[draft PR #539753](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/539753);
rollout and workaround cleanup remain.

AUI's document keydown handler cancels Escape even when its layer stack is empty (JRACLOUD-97876).
This can prevent modern dialogs and popovers from closing because their handlers treat
`defaultPrevented` as evidence that another component already handled Escape.

## Initial patch

Jira's low-priority setup and Confluence's background initialization task call
`installAuiTopLayerInterop` from `@atlaskit/top-layer/install-aui-top-layer-interop`, behind
`platform-dst-top-layer-legacy-interop-1`.

The patch skips AUI's Escape callback only when its layer manager returns `null` for the top layer.
It preserves AUI's existing behavior while any AUI layer is open, including when a modern layer is
above it. Other legacy Escape handlers are unchanged. This addresses empty-stack cancellation, not
full coordination between legacy and modern layers.

Installation is shared per document. It retries on Escape while AUI is loading, then stops after
installation or an unsupported handler is detected. Disabling an installed patch requires a page
reload.

## After rollout

Reassess these workarounds in `jira/src/packages/admin-pages/admin-agent-config-modal/src/`:

- `useCloseMenuOnEscape.tsx`: closes select menus from React before the legacy document handler can
  cancel Escape. Used by the destination-project, source-projects and request-work-type fields.
- `FieldInfoPopup.tsx`: its custom `onContentKeyDown` closes the popup and restores trigger focus
  before the legacy handler runs. The candidate for removal is this Escape workaround, not the popup
  component.

Before removing either workaround, verify that Escape closes only the child menu or popup, restores
focus correctly, and leaves the containing modal open. Check supported top-layer and interop gate
states, plus cases with an open AUI layer. Retain any fallback still needed outside the patch's
coverage. Do not stop respecting `defaultPrevented` in Design System components.
