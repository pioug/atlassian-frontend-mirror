# Follow-up: Tooltip `hasNewContentOnTriggerClick` and the Chromium dismiss timing

## Context

`Tooltip` with `hasNewContentOnTriggerClick` (for example a "Copied!" message) keeps its `hint`
popover open on a trigger press. The `shouldStayOpenOnTriggerClick` layout effect in
`tooltip/src/tooltip.tsx` calls `showPopover()` again from the trigger's `pointerup` and `mouseup`.
It assumes that light dismiss runs before `pointerup` is dispatched.

## The risk

Chromium's `LightDismissFromClick` (stable on main, target Chrome 153,
[crbug 408010435](https://crbug.com/408010435), spec PR
[whatwg/html#11536](https://github.com/whatwg/html/pull/11536)) moves light dismiss to just before
`click`, after `pointerup`. Then the re-show can run before the dismiss, and "Copied!" closes.

WebKit and Firefox still dismiss on `pointerup`.

## To do

1. Check the case in current Chrome stable and in a build with `LightDismissFromClick` enabled.
2. If it fails, move it to a `manual` popover with
   [`useManualLightDismiss`](../../src/use-manual-light-dismiss/index.tsx). A press on the trigger
   then never dismisses it, so no dismiss timing affects it.
