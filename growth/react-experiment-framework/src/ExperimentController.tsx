import React, { Component, ReactNode } from 'react';
import { ExperimentProvider } from './ExperimentContext';
import {
  ExperimentKey,
  EnrollmentDetails,
  Experiments,
  ExperimentEnrollmentConfig,
  ExperimentEnrollmentOptions,
  ResolverPromises,
} from './types';

type Props = {
  // A map of experiment resolvers, keyed by experimentKey.
  experimentEnrollmentConfig: ExperimentEnrollmentConfig;

  // A map of experiment options, keyed by experimentKey. The value of the option
  // under a given key is passed to the experiment resolver with the same key.
  experimentEnrollmentOptions?: ExperimentEnrollmentOptions;

  // Children to render inside the Experiment Controller.
  children?: ReactNode;
};

type State = {
  experiments: Experiments;
};

class ExperimentController extends Component<Props, State> {
  static displayName = 'ExperimentController';

  resolverPromises: ResolverPromises = {};

  constructor(props: Props) {
    super(props);

    const { experimentEnrollmentConfig } = this.props;

    const initialExperiments = Object.keys(experimentEnrollmentConfig).reduce(
      (cumulative: Experiments, experimentKey: ExperimentKey) => ({
        ...cumulative,
        [experimentKey]: {
          isEnrollmentDecided: false,
          enrollmentResolver: () =>
            this.resolverPromises[experimentKey] ||
            this.resolveEnrollmentForExperiment(experimentKey),
        },
      }),
      {},
    );

    this.state = {
      experiments: initialExperiments,
    };
  }

  resolveEnrollmentForExperiment(experimentKey: ExperimentKey) {
    const {
      experimentEnrollmentConfig,
      experimentEnrollmentOptions: options,
    } = this.props;

    const enrollmentResolver = experimentEnrollmentConfig[experimentKey];

    // updates context after resolving
    const enrollmentOptions =
      options instanceof Function ? options(experimentKey) : options;
    const enrollmentPromise = Promise.resolve(
      enrollmentResolver(enrollmentOptions),
    );

    enrollmentPromise.then((enrollmentDetails: EnrollmentDetails) => {
      const { experiments } = this.state;

      this.setState({
        experiments: {
          ...experiments,
          [experimentKey]: {
            isEnrollmentDecided: true,
            enrollmentDetails,
          },
        },
      });
    });

    // cache the resolver promise to avoid resolving enrollment multiple times
    this.resolverPromises[experimentKey] = enrollmentPromise;

    return enrollmentPromise;
  }

  render() {
    const { experiments } = this.state;
    const { children, experimentEnrollmentOptions } = this.props;

    return (
      <ExperimentProvider
        value={{
          experiments,
          options: experimentEnrollmentOptions,
        }}
      >
        {children}
      </ExperimentProvider>
    );
  }
}

export default ExperimentController;
