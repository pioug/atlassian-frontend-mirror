# Experience Tracking

This package provides 3rd parties with the capability to forward the following experience events with the support of `ExperienceTrackerContext` and `ExperienceTracker` components.

1. `taskStart`
2. `taskSuccess`
3. `taskFail`
4. `taskAbort`

To listen to these events, 3rd parties can create its own instance of `ExperienceTracker` and then `subscribe` on those events. Without using React props to pass this experience tracker instance, 3rd parties can wrap the view/edit page components with `ExperienceTrackerContext` and then pass the instance. See usage below for detailed example.

## Experience Event Properties

These components provide the below listed experiences events:

1. `VIEW_PAGE = 'embedded-confluence/view-page'`
2. `EDIT_PAGE_EMBED = 'embedded-confluence/edit-page'`

Experience events trigger the experience tracker to `start`, `succeed`, `abort`, and `fail`. Those events are expected to have `name`, `id`, `action`, and other properties related to errors, timeouts, start/stop and additional attributes.

### name

`name` serves as a generalization of each user experience. These components provide experiences specific to Embedded Confluence and also Confluence.

### id

`id` is a unique identifier for a single experience event. Each experience event should only be fired once. `id` is constructed by concatenating `spaceKey` and `contentId` with a `-` in the middle.

```jsx
const id = `${spaceKey}-${contentId}`;
```

### action

`action` is the state of the experience - `taskStart`, `taskFail`, `taskSuccess`, `taskAbort`

## Usage

```jsx
import {
  ViewPage,
  ExperienceTrackerContext,
  ExperienceTracker,
} from '@atlaskit/embedded-confluence';

const MyViewComponentWithExperienceTracking = ({ contentId, ...props }) => {
  const experienceTracker = new ExperienceTracker();

  // An example of subscribing on experience events
  experienceTracker.subscribe(({ action, name, id, ...event }) => {
    // Do something with the received event:
    switch (action) {
    case taskSuccess:
      if (name === "delete-page" && id === contentId) {
        // Removed contentId from embedding product's database
      }
      break;
    }
  });

  return (
    <ArticleWrapper>
      <ExperienceTrackerContext.Provider value={experienceTracker}>
        <ViewPage
          contentId={contentId}
          // add necessary props here
        />
      <ExperienceTrackerContext.Provider>
    </ArticleWrapper>
  );
};
```
