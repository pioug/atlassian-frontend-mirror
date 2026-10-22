# Follow-up: initial focus targets that mount after the popup opens

## Context

`Popover` reads `initialFocusRef` once, in a layout effect, as it opens. `@atlaskit/popup` passes
its `setInitialFocusRef` target through it. A target that the content sets in a ref callback or a
layout effect is in time. See
[`../architecture/focus.md`](../architecture/focus.md#initialfocusref).

Content that mounts in a later commit is too late with any kind of effect: an entry point, a lazy
import, or a component that waits for data. The read has already happened, so the role default takes
focus instead. The legacy (Popper) path focused the target whenever it arrived, so these consumers
only regress on the top-layer path (`platform-dst-top-layer`).

Each site below has a `TODO` that links here.

## Sites

| Site                                                                                                    | Why it is late                                                  | Calls `.focus()` itself |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| `jira/src/packages/issue/field-agent-sessions-inline-edit-popup/src/AgentSessionsCardList.tsx`          | Entry-point content; sets the target in a `useEffect`           | No                      |
| `jira/src/packages/issue/field-agent-sessions-inline-edit-popup/src/AgentSessionsList.tsx`              | Same as above                                                   | No                      |
| `jira/src/packages/navigation-apps/horizontal-nav-add-tab/src/ui/content/AddTabContent.tsx`             | Entry-point content with a loading fallback                     | No                      |
| `jira/src/packages/portfolio-3/portfolio/src/app-simple-plans/view/top/filter-bar/goal-filter/view.tsx` | Renders `SearchField` after a `LoadingIndicator`                | No                      |
| `jira/src/packages/work-item/work-item-meatball-menu/src/WorkItemActionsMeatballMenuEntrypoint.tsx`     | Entry-point content; no `role`, so the target is ignored anyway | Yes                     |
| `platform/packages/people-and-teams/team-profilecard/src/ui/components/MoreActions.tsx`                 | Async entry-point item; target set from state in a `useEffect`  | No                      |
| `platform/packages/people-and-teams/user-profile-card/src/ui/components/HeaderActions.tsx`              | Profile card body is an entry point                             | Yes                     |
| `confluence/next/packages/content-quick-actions/src/QuickActionsContent.tsx`                            | Lazy content that renders the menu after its query loads        | Yes                     |

## Options

1. **Each consumer focuses its own target when it mounts**, as `HeaderActions`,
   `QuickActionsContent` and the meatball menu already do. This needs no top-layer change, but each
   one repeats the logic.
2. **`Popover` accepts a target that arrives after the open**: for example, `setInitialFocusRef`
   moves focus when it is called after the open and focus is still on the role default or the
   trigger. One fix for every consumer, but it needs a rule for when a late call may still move
   focus (the user may already have moved it).

Pick one before the `platform-dst-top-layer` rollout reaches these consumers.
