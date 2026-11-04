# Follow-up: migrate Popper callers off Popper on the top-layer path

**Status:** TODO (user decision 2026-11-03: migrate behind `platform-dst-top-layer`; do not add
behaviour to `@atlaskit/popper`, which stays legacy positioning only).

## Problem

On the top layer, `@atlaskit/popper` renders a `manual` popover with no role and no `onClose`
(`popper/src/popper-top-layer.tsx`). Its layer is not in the Escape stack, so a modal below takes
the Escape, and the callers' own Escape listeners ignore the stack. Seen: jira InlineCommentPopover
in the issue modal (one Escape closed the whole modal; the sweep change was reverted), and the jira
agent-picker profile card (one Escape closes the card and the picker).

## Plan

Per caller, a gated dual path (Popper on legacy), deleting the caller's Escape, outside-click and
focus code on the top-layer path:

- Anchored to a trigger: move to `@atlaskit/popup`.
- Anchored to another real element (annotation mark, decoration span, hover target): top-layer
  `Popover` + `useAnchoredPopover` on that element + `useManualLightDismiss`.
- Anchored to a moving point with no element (caret, selection rectangle): not supported yet.
  `useAnchoredPopoverAtPoint` latches its point once per activation. Options: find an element to
  anchor to, or add a live point to the top layer (new API).
- Spotlights: `@atlaskit/spotlight` where it fits.

## Inventory (2026-11-03)

About 217 non-test files import `@atlaskit/popper`; about 85 render `Popper`, `Manager` or
`Reference` (including callers of jira `JiraPopper` and editor-common `Layer`).

| Caller                                                                                                                                           | Group                           | Notes                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| jira `issue-view-activity-comment` InlineCommentPopover                                                                                          | moving point (selection rect)   |                                                                                                                                  |
| jira `internal-fields` WivInlineCommentView                                                                                                      | other element (annotation mark) |                                                                                                                                  |
| jira `agent-picker` AgentPickerProfileCard, AgentPickerFragmentedProfileCard                                                                     | other element (option row)      | the picker's own Escape handlers must also skip while a layer is open inside them, and the card must render in place (no Portal) |
| platform `reactions` ReactionPicker                                                                                                              | trigger (Popup)                 |                                                                                                                                  |
| platform `editor-plugin-mentions` ProfileCardComponent, PopperWrapper                                                                            | other element (mention node)    |                                                                                                                                  |
| platform `chords` AnchoredPopup                                                                                                                  | trigger rendered by the caller  | decide: element pattern on the trigger, or change callers                                                                        |
| platform `nudge-tooltip` NudgeSpotlight                                                                                                          | spotlight or other element      |                                                                                                                                  |
| jira `portfolio-3` SkipLinks                                                                                                                     | trigger                         | decide: it opens on focus, so focus return would reopen it                                                                       |
| platform `editor-common` DropList                                                                                                                | trigger                         | on the top-layer path only with `platform-dst-popper-consolidation`; own batch with editor owners                                |
| Others with their own Escape/outside/focus code (VendorRulePreview, AddTeamPopup, AudioButton, jsm row status, avp, insights, help-center menus) | trigger                         |                                                                                                                                  |
| Others (JiraCascadingSelectField, EditViewPopup, kitsune snippets, avp overlay_input)                                                            | other element                   |                                                                                                                                  |
| Others (jql autocomplete, jfx suggestions, incident chart, trello hover, insights chart tooltip)                                                 | moving point                    |                                                                                                                                  |
| Validation messages, hover cards, floating buttons, forwarding wrappers                                                                          | none                            | no Escape/outside/focus code; no change needed                                                                                   |

Moving-point options: (1) `Popover` + `useAnchoredPopoverAtPoint` + `useManualLightDismiss` (same
position as Popper's top-layer path today, which also fixes the point at open; joins the Escape
stack; does not follow scroll); (2) give the point a real element (for example a draft highlight
`<span>` around the selection) and use the element pattern; (3) a DS hook that follows a moving
point (new API, needs a DS decision).

DS-owned Popper users on the top-layer path: legacy Spotlight `PopoverContent` (fixed by the
`platform-dst-top-layer-spotlight` path) and `@atlaskit/onboarding` SpotlightDialog (deprecated).
