/* eslint-disable react/prop-types,react/no-multi-comp */

import React, { Component } from 'react';

import asExperiment from '../src/asExperiment';
import ExperimentController from '../src/ExperimentController';
import { EnrollmentDetails } from '../src/types';

import { Control, VariantA, VariantB, Broken, Loader } from './_common';

export const ExperimentWrapped = asExperiment(
  {
    variantA: VariantA,
    variantB: VariantB,
    broken: Broken,
    control: Control,
    fallback: Control,
  },
  'myExperimentKey',
  {
    onError: (error) => console.log('onError', error.message),
    onExposure: (exposureDetails) => console.log('onExposure', exposureDetails),
  },
  Loader,
);

const resolveAfterDelay = (
  resolvesTo: ResolvesTo,
  delay = 2000,
): Promise<EnrollmentDetails> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(resolvesTo);
    }, delay);
  });

type ResolvesTo = {
  cohort: string;
  isEligible: boolean;
  ineligibilityReasons?: string[];
};
type Scenario = {
  name: string;
  resolvesTo: ResolvesTo;
  hasError?: boolean;
};
const scenarios: Scenario[] = [
  {
    name: 'Control cohort and eligible',
    resolvesTo: {
      cohort: 'control',
      isEligible: true,
    },
  },
  {
    name: 'Variant A cohort and eligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: true,
    },
  },
  {
    name: 'Variant B cohort and eligible',
    resolvesTo: {
      cohort: 'variantB',
      isEligible: true,
    },
  },
  {
    name: 'Reverts to control when ineligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: false,
      ineligibilityReasons: ['because I say so'],
    },
  },
  {
    name: 'Reverts to control for non-defined cohort',
    resolvesTo: {
      cohort: 'nonExistentCohort',
      isEligible: true,
    },
    hasError: true,
  },
  {
    name: 'Reverts to control when variant component throws at render',
    resolvesTo: {
      cohort: 'broken',
      isEligible: true,
    },
    hasError: true,
  },
];

type State = {
  areErrorScenariosActive: boolean;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<{}, State> {
  state = {
    areErrorScenariosActive: false,
  };

  handleErrorHandlingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ areErrorScenariosActive: !!event.target.checked });
  };

  render() {
    const { areErrorScenariosActive } = this.state;
    const filteredScenarios = areErrorScenariosActive
      ? scenarios
      : scenarios.filter((s) => !s.hasError);
    return (
      <table style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Sync render</th>
            <th>Async render (2s delay)</th>
          </tr>
        </thead>
        <tbody>
          {filteredScenarios.map(({ name, resolvesTo }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>
                <ExperimentController
                  experimentEnrollmentConfig={{
                    myExperimentKey: () => resolvesTo,
                  }}
                >
                  <ExperimentWrapped title="Component" />
                </ExperimentController>
              </td>
              <td>
                <ExperimentController
                  experimentEnrollmentConfig={{
                    myExperimentKey: () => resolveAfterDelay(resolvesTo, 2000),
                  }}
                >
                  <ExperimentWrapped title="Component" />
                </ExperimentController>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <label>
                <input
                  type="checkbox"
                  value={areErrorScenariosActive.toString()}
                  onChange={this.handleErrorHandlingChange}
                />
                Show error handling scenarios
              </label>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}
