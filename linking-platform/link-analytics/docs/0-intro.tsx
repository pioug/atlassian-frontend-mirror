import React from 'react';
import { code, md, Example, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This package is designed to help instrument analytics of link lifecycle events such as link creation and deletion.

### Prerequisites

The following packages are  \`@atlaskit/link-analytics\`'s peer dependencies are required.
Please check our [package.json](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/linking-platform/link-analytics/package.json) for versioning.

* \`react\`
* \`@atlaskit/link-provider\`


### Installation

${code`yarn add @atlaskit/link-analytics`}

## Usage

${code`
  import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';

  const { linkCreated, linkDeleted } = useSmartLinkLifecycleAnalytics();

  // call when user creates a link
  linkCreated({ url }, analyticEvent)

  // call when user deletes a link
  linkDeleted({ url }, analyticEvent)
`}


### Example Link Created with Link Picker

${code`
  import { LinkPicker } from '@atlaskit/link-picker';
  import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';

  const Component = () => {
    const { linkCreated } = useSmartLinkLifecycleAnalytics();

    const handleCreateLink = (payload, analytic) => {
      // ... execute your insert logic ...

      // ... track the creation of the link ...
      linkCreated(payload, analytic)
    }

    return (
      <LinkPicker
        onSubmit={handleCreateLink}
        {...}
        />
    )
  }
`}

## Analytic Event Hand-off

Links don't just create (update, or delete) themselves!
We're not interested just that a link has been created, but we are also interested as to why!
What event triggered this link lifecycle event?

For link insertions and updates, its likely the form submission of the link picker thats lead to a link being created.
But that's not the only way links can be created!

Consider an "undo" event. If a user can undo an insert, we can consider this a link deletion. The same can be said for an undo of a deletion (link created).
If the source event hasn't come from a linking platform component, then you're likely already tracking these interactions with instrumentation of your own.
We can associate these events with a "hand-off" of an existing analytic event as the "source" event that lead to the link lifecycle event.

${code`
  import {
    createAndFireEvent,
    useAnalyticsEvents,
  } from '@atlaskit/analytics-next';
  import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';

  // ...

  const { linkCreated, linkDeleted } = useSmartLinkLifecycleAnalytics();

  // ...

  const onUndoDelete = ({ url }) => {
    //  your existing event
    const analytic = createAndFireEvent(SOME_CHANNEL)({
      actionSubject: 'linkDeletion',
      action: 'undo',
    })(createAnalyticsEvent);

    //  hand-off event
    linkDeleted({ url }, analytic)
  }

  // ...

  const onUndoInsert = ({ url }) => {
    //  your existing event
    const analytic = createAndFireEvent(SOME_CHANNEL)({
      actionSubject: 'linkInsert',
      action: 'undo',
    })(createAnalyticsEvent);

    //  hand-off event
    linkDeleted({ url }, analytic)
  }
`}


## Link Provider

Make sure the usage of this hook is within the scope of a \`LinkProvider\` context.
The link provider provides the ability to connect and resolve meta data about the link.

## Smart Link Id

We've afforded the link tracking handlers with a slot to provide a \`smartLinkId\`.
While this is not currently in use, expect to see the this in the future to enhance insights.

${code`
  linkCreated({ url, smartLinkId }, analytic)
`}


## Complete Example

${(
  <Example
    Component={require('../examples/00-lifecycle-events').default}
    title="Example"
    source={require('!!raw-loader!../examples/00-lifecycle-events')}
  />
)}

`;
