# README

## What is this package for?

A set of React components that facilitate experimentation in product, by allowing React
components to be swapped dynamically at run-time.

## Installing the framework

```sh
npm i -S @atlaskit/react-experiment-framework
```

## Usage

Wrap your React app in the ExperimentController component

```js
import { ExperimentController } from '@atlaskit/react-experiment-framework';

ReactDOM.render(
  <ExperimentController experimentEnrollmentConfig={experimentEnrollmentConfig}>
    <App />
  </ExperimentController>,
  document.getElementById('root'),
);
```

The experimentEnrollmentConfig prop provided to the ExperimentController should be a map of experimentKey (string) to an enrollmentResolver. The resolver should return a promise that resolves to a cohort and provide eligiblity details of the user for the experiment

```js

// example of a resolver
import type { EnrollmentDetails, ExperimentEnrollmentConfig } from '@atlaskit/react-experiment-framework';

const experimentEnrollmentResolver = async (): EnrollmentDetails => {
    // example where the cohort is provided by an async feature flag fetch, e.g., LD client, or graphql query
    const featureFlagValue = await getFeatureFlag('myExperimentFeatureFlag');

    return {
        cohort: featureFlagValue,
        isEligble: true,
        ineligibilityReasons: null
    };
}

// example of experiment enrollment config
const experimentEnrollmentConfig: ExperimentEnrollmentConfig = {
    myExperimentKey: experimentEnrollmentResolver,
    ...,
};
```

The above sets up the react context provider for experimentation.

Then to set up your experiment, wrap an existing React Component in your app with the Higher Order Component / function, asExperiment.

```js

// Your original component that provides the current experience you intend to swap with the experiment
class ExistingComponent extends React.Component {
    ...
}

// Your new component that provides the experimental experience
class ExperimentReplacementComponent extends React.Component {
    ...
}

export default asExperiment({
    // example cohort names used here, control and variant, but they can be whatever you like
    control: ExistingComponent,
    variant: ExperimentReplacementComponent,

    // fallback is not optional, however, this is what is rendered in the event of a error encountered or when the user
    // is ineligible
    fallback: ExistingComponent,
}, 'myExperimentKey',
{
    // callbacks to trigger tracking on exposure and errors, these are just examples provide your own
    onExposure: (data) => analyticsClient.trigger('experiment-exposure', data),
    onError: (data) => analyticsClient.trigger('experiment-error', data)
},
    // optional component to show while enrollment is being resolved. When absent, renders null during resolution.
    Spinner,
);
```
