import React from 'react';
import {
  md,
  Example,
  code,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

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

  The React experiment framework is a set of React component that facilitate easier product experimentation.

  It provides a way of swapping React components at run-time, e.g., switching a control component for your new
  variant component.

  Each targeted react component is wrapped in an ExperimentSwitch component, that toggles which component will render
  based on context passed down from an ExperimentController component.

  ## Usage

  The ExperimentController is passed a configuration object via the experimentEnrollmentConfig prop. 
  It's a map of experiment resolvers -- functions that decide which variant should be rendered for each experiment.
  If additional data needs to be passed to the resolvers (e.g. from a Redux store), the experimentEnrollmentOptions prop can be used.
  The resolvers can be asynchronous, and usually will.
  
  This resolver based approach allows the rendering of targeted components to be blocked until the resolver is completed, and the
  appropriate experience is only then shown to the user; thus preventing a swapping of experience. 
  A loading component can be provided, to show while the enrollment is being processed.

  ${code`import { 
    asExperiment, 
    CohortTracker,
    ExperimentProvider,
    ExperimentConsumer,
    ExperimentController } from '@atlaskit/@atlaskit/react-experiment-framework';`}

  In some cases the enrollmentResolver will just be a sync call to featureFlag client, to lookup the cohort that a given user is in. However, sometimes it might be required to
  additionally do REST calls, or other adhoc checks to see whether your user should get an experience, e.g., a message that should only show once to a customer could require
  a feature flag check plus a check to a store service to lookup whether or not the user has seen that message previously. In the case that async is not needed, just return a resolved
  promise with the enrollment details.

  In addition to returning the cohort in the enrollment details, there is an isEligible property. A user may have been randomly assigned to the variation, but not be eligible to see the experience.
  E.g., eligiblilty might require the user to have a locale where English is the dominant language. In these cases where isEligible is set to false,  the user is shown the fallback experience, i.e., the control component.

  In terms of tracking the success and failures of the experiment; the framework provides callbacks for onExposure (when an experience is shown), and onError (when an error was encountered due to misconfiguration or the component provided threw at render)
  
  ${(
    <Example
      packageName="@atlaskit/growth"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="ExperimentController Props"
      props={require('!!extract-react-types-loader!../src/ExperimentController')}
    />
  )}

  ${(
    <Props
      heading="CohortTracker Props"
      props={require('!!extract-react-types-loader!../src/CohortTracker')}
    />
  )}
`;
