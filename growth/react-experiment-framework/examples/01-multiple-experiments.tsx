/* eslint-disable react/prop-types,react/no-multi-comp */

import React, { Component, ComponentType } from 'react';

import asExperiment from '../src/asExperiment';
import ExperimentController from '../src/ExperimentController';
import { ExperimentEnrollmentConfig } from '../src/types';

import { Control, VariantA, VariantB, Broken, Loader } from './_common';

export const createExperiment = (experimentKey: string) =>
  asExperiment(
    {
      variantA: VariantA,
      variantB: VariantB,
      broken: Broken,
      control: Control,
      fallback: Control,
    },
    experimentKey,
    {
      onError: (error) => console.log('onError', error.message),
      onExposure: (exposureDetails) =>
        console.log('onExposure', exposureDetails),
    },
    Loader,
  );

export const createNestedExperiment = (
  experimentKey: string,
  children: ComponentType[],
) =>
  asExperiment(
    {
      parent: () => (
        <div>
          <div>Parent</div>
          <div style={{ marginLeft: '10px' }}>
            {children.map((ChildExperiment: ComponentType, key: number) => (
              <ChildExperiment key={key} />
            ))}
          </div>
        </div>
      ),
      child: () => (
        <div>
          <div>Child</div>
          <div style={{ marginLeft: '10px' }}>
            {children.map((ChildExperiment: ComponentType, key: number) => (
              <ChildExperiment key={key} />
            ))}
          </div>
        </div>
      ),
      fallback: () => (
        <div>
          <span>fallback. This should not show!</span>
        </div>
      ),
    },
    experimentKey,
    {
      onError: (error) => console.log('onError', error.message),
      onExposure: (exposureDetails) =>
        console.log('onExposure', exposureDetails),
    },
    Loader,
  );

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component<{}> {
  render() {
    // define initial experiment configuration
    const experimentEnrollmentConfig: ExperimentEnrollmentConfig = {
      nestedParent: () => ({
        isEligible: true,
        cohort: 'parent',
      }),
      childOne: () => ({
        isEligible: true,
        cohort: 'child',
      }),
      childTwo: () => ({
        isEligible: true,
        cohort: 'variantA',
      }),
    };
    // define a set of cohorts that we want to show for sibling experiments
    const siblingCohorts = ['variantA', 'variantB', 'control'];

    // create a list of experiment components using asExperiment()
    const siblings: ComponentType[] = [];
    siblingCohorts.forEach((cohort, i) => {
      const key = `sibling-${i}`;
      // update our experiment configuration to add our new experiment
      experimentEnrollmentConfig[key] = () => ({
        isEligible: true,
        cohort,
      });
      // create experiment switch component using asExperiment()
      siblings.push(createExperiment(key));
    });

    // lets define a tree of experiments
    const Nested = createNestedExperiment('nestedParent', [
      // create an experiment with children experiments which
      // are the same as the sibling experiments above
      createNestedExperiment('childOne', siblings),
      // create another child experiment with no children
      createExperiment('childTwo'),
    ]);

    return (
      <div>
        <h2>Multiple experiments in a single controller</h2>
        <ExperimentController
          experimentEnrollmentConfig={experimentEnrollmentConfig}
        >
          <h3>Sibling Experiments</h3>
          {siblings.map((Experiment: ComponentType, key: number) => (
            <Experiment key={key} />
          ))}
          <h3>Nested Experiments</h3>
          <Nested />
        </ExperimentController>
      </div>
    );
  }
}
