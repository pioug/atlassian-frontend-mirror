import React from 'react';

import {
  AtlassianInternalWarning,
  code,
  DevPreviewWarning,
  Example,
  md,
  Props,
} from '@atlaskit/docs';

const BasicExample = require('../examples/00-usage').default;

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  This component is used to ask for feedback from the user, without affecting their usage of the page. It is styled similar to a \`flag\`.

  The user flow for this component is:

  #### Phase 1: Feedback

  - Choosing a feedback score
  - **(Optional)** Writing extra feedback in a \`textarea\`
  - **(Optional)** User selects if they can be contacted about their feedback.
  This is automatically set to \`true\` on the first change event for the \`textarea\`. It is set to \`false\` by default.

  #### Phase 2 (Optional): Atlassian Research Signup

  This phase will be entered when:

  1. The user has selected they want to be contacted about their feedback
  2. \`getUserHasAnsweredMailingList()\` has resolved to \`false\`

  If this phase is not entered then a thank you message is displayed.

  In this phase a prompt is opened which asks the user if they want to join the **Atlassian Research Group**.

  After \`onMailingListAnswer()\` has resolved:

  - If the user selected **yes** a thank you message is displayed
  - If the user selected **no** the survey is closed.

  #### Dismissing

  \`onDismiss\` will be called when the survey is finished. This can happen when:

  - The user explicitly closes the survey
  - The user finishes the survey. The survey will be auto dismissed after a small delay
  - The \`<SurveyComponent/>\` is unmounted

  \`onDismiss\` will only ever be called once

  \`onDismiss\` is called with arguments: \`{ trigger: DismissTrigger }\`. This can be used to distinguish between different rationales for dismissing

  ${code`
  // Types

  export enum DismissTrigger {
    AutoDismiss = 'AUTO_DISMISS',
    Manual = 'MANUAL',
    Finished = 'FINISHED',
    Unmount = 'UNMOUNT',
  }

  export type OnDismissArgs = { trigger: DismissTrigger };

  onDismiss: (args: OnDismissArgs) => void;

  // These types are exported publicly for you to use

  import {DismissTrigger, OnDismissArgs} from '@atlaskit/contextual-survey';
  `}

  #### Responsibilities

  - \`<SurveyMarshal/>\`: Responsible for placement and animation for the survey.
  - \`<ContextualSurvey/>\`: Renders the survey questions

  ## Usage

  ${code`import { ContextualSurvey, SurveyMarshal } from '@atlaskit/avatar';`}

  ${(
    <Example
      packageName="@atlaskit/contextual-survey"
      Component={() => <BasicExample height="500px" />}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-usage')}
    />
  )}

  ${(
    <Props
      heading="Contextual Survey Props"
      props={require('!!extract-react-types-loader!../src/components/ContextualSurvey')}
    />
  )}

${(
  <Props
    heading="Survey Marshal Props"
    props={require('!!extract-react-types-loader!../src/components/SurveyMarshal')}
  />
)}
`;
