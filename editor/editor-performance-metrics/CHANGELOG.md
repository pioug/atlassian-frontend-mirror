# @atlaskit/editor-performance-metrics

## 1.2.0

### Minor Changes

- [#107955](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107955)
  [`02bde230bde80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/02bde230bde80) -
  [AFO-3352] Multiple improvements to detect TTAI on Editor

  ## Timeline Hold Mechanism

  We've introduced a new hold mechanism to the Timeline system, allowing for better tracking and
  management of asynchronous operations:

  1. `TimelineHoldable` interface:

     - Defines a `hold` method to initiate a hold operation.
     - Returns an `UnHoldFunction` to release the hold when the operation is complete.

  2. New event types:
     - `HoldIdleStartEvent`: Marks the start of a hold operation.
     - `HoldIdleEndEvent`: Marks the end of a hold operation.
     - `HoldIdleTimeoutEvent`: Indicates when a hold operation has exceeded the maximum duration.

  These new features provide more precise control over idle time detection during asynchronous
  operations.

  ## Wrapper Functions for Web APIs

  1. `wrapperFetch`:

     - Integrates fetch calls with the Timeline system.
     - Automatically applies hold and unhold operations for each fetch call.

  2. `wrapperTimers`:
     - Integrates setTimeout and clearTimeout with the Timeline system.
     - Applies hold operations for timeouts between 0 and 2000ms.

  These wrappers enable seamless integration of common web APIs with the Timeline system.

  # Improvements

  ## Timeline Controller Enhancements

  1. Hold Management:

     - Implemented `checkHoldTimeout` to manage hold timeouts.
     - Modified `scheduleNextIdle` to respect active holds.

  2. Configuration:

     - Added `maxHoldDuration` to `TimelineOptions` to configure the maximum duration for holds.

  3. Subscription Management:
     - Implemented `onceAllSubscribersCleaned` method to allow cleanup operations when all
       subscribers are unsubscribed.

  ## Code Organization

  1. Split Timeline-related code into separate files:

     - `timelineTypes.ts`: Contains type definitions for Timeline events and options.
     - `timelineInterfaces.ts`: Defines interfaces for Timeline functionality.

  2. Improved modularity and maintainability of the codebase.

  ## EditorPerformanceObserver Updates

  - Modified to use both `TimelineClock` and `TimelineHoldable` interfaces.
  - Implemented wrapper application and cleanup logic.

  # Documentation Updates

  - Added comprehensive JSDoc for new interfaces and methods.
  - Updated existing documentation to reflect new functionality.

  # Testing

  - Added new test files: `wrapperFetch.test.ts` and `wrapperTimers.test.ts`.
  - Enhanced existing tests in `timeline.test.ts` to cover new functionality.
  - Added `editorPerformanceObserver.test.ts` to test wrapper application and cleanup.

  # Important Notes

  - These enhancements maintain backward compatibility with existing implementations.
  - The core timeline functionality remains unchanged; only new features have been added.
  - Wrapper functions are applied only when needed and cleaned up when no longer in use.

## 1.1.0

### Minor Changes

- [#102282](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102282)
  [`5e1d47c2c7c16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e1d47c2c7c16) - #
  New Features

  ## Enhanced Mouse Event Categories

  We've introduced two new categories for `onUserLatency` to provide more granular insights into
  mouse interactions:

  1. `mouse-movement`:

     - mouseenter
     - mouseleave
     - mousemove
     - mouseover
     - mouseout

  2. `mouse-action`:
     - click
     - dblclick
     - mousedown
     - mouseup
     - contextmenu

  These new categories offer more detailed control and analysis of different types of mouse events.

  # Improvements

  ## Timeline idle time

  The timeline is considered idle when no new events are added for a specific period. Previously,
  this duration was set to `60ms`. However, after some real-world tests, we found that increasing
  this duration to `200ms` provides a more stable TTAI result.

  This adjustment aims to enhance the accuracy and reliability of performance measurements by
  reducing premature idle detections, thus providing a more realistic assessment of user-perceived
  performance.

  ## React API Enhancements

  1. [ED-26251] Optimized Time to Actively Interactive (TTAI) for Time to Visually Complete (TTVC)

     - The `onTTVC` callback is now triggered immediately after the first idle slot, without waiting
       for a buffer threshold.
     - This change improves the accuracy and responsiveness of TTVC measurements.

  2. React API Refactoring
     - Improved code style and readability for easier maintenance and understanding.

  ## Performance Optimizations

  1. Task Splitting for Data Processing
     - Implemented chunk-based processing in `createHeatmapFromEvents` to prevent long-running
       blocking tasks.
     - This enhancement ensures better responsiveness, especially on slower devices.

  ## Documentation Updates

  - New comprehensive documentation for the React API is now available at
    `https://atlaskit.atlassian.com/packages/editor/editor-performance-metrics`.
  - The documentation provides detailed information on using and implementing performance metrics in
    React applications.

  # Important Notes

  - The core metric calculation methods remain unchanged; only the timing of calculations has been
    optimized.
  - Existing implementations should continue to function without requiring modifications.
  - These enhancements maintain the library's commitment to low-priority processing on the client
    side, adhering to performance best practices.

## 1.0.0

### Major Changes

- [#174435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174435)
  [`fec297262a299`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fec297262a299) -
  [NO ISSUE] Initial code for Editor Performance Metrics
