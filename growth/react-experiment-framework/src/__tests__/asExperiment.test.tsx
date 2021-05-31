/* eslint-disable react/no-multi-comp */

import React, { Component, ReactNode, ComponentType } from 'react';
import { mount } from 'enzyme';

import ExperimentController from '../ExperimentController';
import { ExperimentProvider } from '../ExperimentContext';
import asExperiment, { ExperimentComponentMap } from '../asExperiment';
import {
  ExperimentEnrollmentResolver,
  Experiments,
  ExperimentEnrollmentConfig,
  ExperimentEnrollmentOptions,
  EnrollmentOptions,
  ExposureDetails,
} from '../types';
import CohortTracker from '../CohortTracker';

const createDumbComponent = (componentName: string) => {
  class DumbComponent extends Component<{}> {
    render() {
      return <div>{componentName}</div>;
    }
  }

  return DumbComponent;
};

class LoadingComponent extends Component<{}> {
  render() {
    return <div>Loading...</div>;
  }
}
type onError = (error: Error, options?: ExperimentEnrollmentOptions) => void;
type onExposure = (
  exposureDetails: ExposureDetails,
  options?: ExperimentEnrollmentOptions,
) => void;

describe('asExperiment', () => {
  let enrollmentResolver: ExperimentEnrollmentResolver;
  let enrollmentResolverTwo: ExperimentEnrollmentResolver;
  let enrollmentOptions: EnrollmentOptions;
  let experiments: {
    experiments: Experiments;
    options?: ExperimentEnrollmentOptions;
  };
  let componentMap: ExperimentComponentMap;
  let callbacks: { onError: onError; onExposure: onExposure };
  let onError: onError;
  let onExposure: onExposure;
  let ControlComponent: ComponentType;
  let VariantComponent: ComponentType;
  let FallbackComponent: ComponentType;

  beforeEach(() => {
    enrollmentResolver = jest.fn();
    enrollmentResolverTwo = jest.fn();
    enrollmentOptions = {};

    experiments = {
      experiments: {
        myExperimentKey: {
          isEnrollmentDecided: false,
          enrollmentResolver,
        },
      },
      options: enrollmentOptions,
    };

    ControlComponent = createDumbComponent('control');
    VariantComponent = createDumbComponent('variant');
    FallbackComponent = createDumbComponent('fallback');

    componentMap = {
      control: ControlComponent,
      variant: VariantComponent,
      fallback: FallbackComponent,
    };

    onError = jest.fn();
    onExposure = jest.fn();

    callbacks = {
      onError,
      onExposure,
    };
  });

  describe('While resolving enrollment', () => {
    it('should show the loader when provided in callbacks', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(wrapper.find(LoadingComponent).exists()).toBeTruthy();

      // should make the call to resolve enrollment
      expect(enrollmentResolver).toBeCalled();
    });

    it('should not show the loader when not provided in callbacks', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(wrapper.find(LoadingComponent).exists()).toBeFalsy();

      // should make the call to resolve enrollment
      expect(enrollmentResolver).toBeCalled();
    });

    it('should call enrollment resolver with options object if set', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
      );

      mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(enrollmentResolver).toBeCalledWith(enrollmentOptions);
    });

    it('should call enrollment resolver with options function object if set', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
      );
      const mockOptions = {
        example: 'value',
      };
      const mockOptionsResolver = (
        experimentKey: string,
      ): EnrollmentOptions => {
        return ({
          myExperimentKey: mockOptions,
          differentExperiment: 'this should not get returned',
        } as any)[experimentKey];
      };
      const mockExperiments = {
        ...experiments,
        options: mockOptionsResolver,
      };

      mount(
        <ExperimentProvider value={mockExperiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(enrollmentResolver).toBeCalledWith(mockOptions);
    });
  });

  describe('Control & eligible', () => {
    beforeEach(() => {
      experiments = {
        experiments: {
          myExperimentKey: {
            isEnrollmentDecided: true,
            enrollmentDetails: {
              cohort: 'control',
              isEligible: true,
            },
          },
        },
        options: enrollmentOptions,
      };
    });

    it('should show the control component', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(wrapper.find(LoadingComponent).exists()).toBeFalsy();
      expect(wrapper.find(ControlComponent).exists()).toBeTruthy();
    });

    it('should mount the cohort tracker with the right props', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      const cohortTracker = wrapper.find(CohortTracker);

      expect(cohortTracker.exists()).toBeTruthy();
      expect(cohortTracker.props().exposureDetails).toEqual({
        cohort: 'control',
        experimentKey: 'myExperimentKey',
        isEligible: true,
      });
      expect(cohortTracker.props().onExposure).toEqual(onExposure);
    });
  });

  describe('Variant & eligible', () => {
    beforeEach(() => {
      experiments = {
        experiments: {
          myExperimentKey: {
            isEnrollmentDecided: true,
            enrollmentDetails: {
              cohort: 'variant',
              isEligible: true,
            },
          },
        },
        options: enrollmentOptions,
      };
    });

    it('should show the variant component', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(wrapper.find(LoadingComponent).exists()).toBeFalsy();
      expect(wrapper.find(VariantComponent).exists()).toBeTruthy();
    });

    it('should mount the cohort tracker with the right props', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      const cohortTracker = wrapper.find(CohortTracker);

      expect(cohortTracker.exists()).toBeTruthy();
      expect(cohortTracker.props().exposureDetails).toEqual({
        cohort: 'variant',
        experimentKey: 'myExperimentKey',
        isEligible: true,
      });
      expect(cohortTracker.props().onExposure).toEqual(onExposure);
    });
  });

  describe('Variant & ineligible', () => {
    beforeEach(() => {
      experiments = {
        experiments: {
          myExperimentKey: {
            isEnrollmentDecided: true,
            enrollmentDetails: {
              cohort: 'variant',
              isEligible: false,
              ineligibilityReasons: ['no-permission'],
            },
          },
        },
        options: enrollmentOptions,
      };
    });

    it('should show the fallback component', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      expect(wrapper.find(LoadingComponent).exists()).toBeFalsy();
      expect(wrapper.find(FallbackComponent).exists()).toBeTruthy();
    });

    it('should mount the cohort tracker with the right props', () => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentProvider value={experiments}>
          <WrappedComponent />
        </ExperimentProvider>,
      );

      const cohortTracker = wrapper.find(CohortTracker);

      expect(cohortTracker.exists()).toBeTruthy();
      expect(cohortTracker.props().exposureDetails).toEqual({
        cohort: 'variant',
        experimentKey: 'myExperimentKey',
        isEligible: false,
        ineligibilityReasons: ['no-permission'],
      });
      expect(cohortTracker.props().onExposure).toEqual(onExposure);
    });
  });

  describe('Bail behaviour', () => {
    describe('Variant but component is broken', () => {
      // eslint-disable-next-line react/require-render-return
      class BrokenComponent extends Component<{}> {
        render(): ReactNode {
          throw new Error('Exploded');
        }
      }

      beforeEach(() => {
        experiments = {
          experiments: {
            myExperimentKey: {
              isEnrollmentDecided: true,
              enrollmentDetails: {
                cohort: 'variant',
                isEligible: true,
              },
            },
          },
          options: enrollmentOptions,
        };

        componentMap = {
          ...componentMap,
          variant: BrokenComponent,
        };

        // Shuts react up. I know its caught by the error boundary, I built it that way.
        jest.spyOn(global.console, 'error').mockImplementation(() => null);
      });

      it('should show the fallback component', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(BrokenComponent).exists()).toBeFalsy();
        expect(wrapper.find(FallbackComponent).exists()).toBeTruthy();
      });

      it('should call onError', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(onError).toBeCalledWith(
          new Error('Exploded'),
          experiments.options,
        );
      });

      it('should not mount the cohort tracker', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(CohortTracker).exists()).toBeFalsy();
      });
    });

    describe('Missing experiment key in configuration', () => {
      it('should show the fallback component', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'nonExistentKey',
          callbacks,
          LoadingComponent,
        );
        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(FallbackComponent).exists()).toBeTruthy();
      });

      it('should call onError', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'nonExistentKey',
          callbacks,
          LoadingComponent,
        );

        mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(onError).toBeCalledWith(
          new Error(
            'Experiment Key nonExistentKey does not exist in configuration',
          ),
          experiments.options,
        );
      });

      it('should not mount the cohort tracker', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'nonExistentKey',
          callbacks,
          LoadingComponent,
        );

        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(CohortTracker).exists()).toBeFalsy();
      });
    });

    describe('Missing enrollment details after resolving enrollment', () => {
      beforeEach(() => {
        experiments = {
          experiments: {
            myExperimentKey: {
              isEnrollmentDecided: true,
            },
          },
          options: enrollmentOptions,
        };
      });

      it('should show the fallback component', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );
        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(FallbackComponent).exists()).toBeTruthy();
      });

      it('should call onError', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(onError).toBeCalledWith(
          new Error(
            'Experiment myExperimentKey has missing enrollment details',
          ),
          experiments.options,
        );
      });

      it('should not mount the cohort tracker', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'nonExistentKey',
          callbacks,
          LoadingComponent,
        );

        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(CohortTracker).exists()).toBeFalsy();
      });
    });

    describe('Enrollment resolved to a cohort without a mapping to a component', () => {
      beforeEach(() => {
        experiments = {
          experiments: {
            myExperimentKey: {
              isEnrollmentDecided: true,
              enrollmentDetails: {
                cohort: 'nonExistentCohort',
                isEligible: true,
              },
            },
          },
        };
      });

      it('should show the fallback component', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );
        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(FallbackComponent).exists()).toBeTruthy();
      });

      it('should call onError', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(onError).toBeCalledWith(
          new Error(
            'Cohort nonExistentCohort does not exist for experiment myExperimentKey',
          ),
          undefined,
        );
      });

      it('should not mount the cohort tracker', () => {
        const WrappedComponent = asExperiment(
          componentMap,
          'myExperimentKey',
          callbacks,
          LoadingComponent,
        );

        const wrapper = mount(
          <ExperimentProvider value={experiments}>
            <WrappedComponent />
          </ExperimentProvider>,
        );

        expect(wrapper.find(CohortTracker).exists()).toBeFalsy();
      });
    });
  });

  describe('Support multiple Experiments', () => {
    let enrollmentConfig: ExperimentEnrollmentConfig;
    beforeEach(() => {
      enrollmentResolver = jest.fn().mockReturnValue({
        cohort: 'variant',
        isEligible: true,
      });
      enrollmentResolverTwo = jest.fn().mockReturnValue({
        cohort: 'variant',
        isEligible: true,
      });
      enrollmentConfig = {
        myExperimentKey: enrollmentResolver,
        myExperimentKeyTwo: enrollmentResolverTwo,
      };
    });

    it('should resolve all experiments', (done) => {
      const WrappedComponent = asExperiment(
        componentMap,
        'myExperimentKey',
        callbacks,
        LoadingComponent,
      );
      const WrappedComponentTwo = asExperiment(
        componentMap,
        'myExperimentKeyTwo',
        callbacks,
        LoadingComponent,
      );

      const wrapper = mount(
        <ExperimentController experimentEnrollmentConfig={enrollmentConfig}>
          <WrappedComponent />
          <WrappedComponentTwo />
        </ExperimentController>,
      );

      setTimeout(() => {
        wrapper.update();

        // should make the call to resolve enrollment
        expect(enrollmentResolver).toBeCalled();
        // should make the call to resolve the second enrollment
        expect(enrollmentResolverTwo).toBeCalled();

        // make sure two experiments were rendered
        expect(wrapper.find(CohortTracker)).toHaveLength(2);
        // make sure the expected text is rendered
        expect(wrapper.text()).toEqual('variantvariant');

        // there shouldnt be any errors
        expect(onError).not.toBeCalled();

        done();
      });
    });

    it('should resolve nested experiments', (done) => {
      const InnerExperimentComponent = asExperiment(
        componentMap,
        'myExperimentKeyTwo',
        callbacks,
      );
      const OuterExperimentComponent = asExperiment(
        {
          variant: InnerExperimentComponent,
          fallback: InnerExperimentComponent,
        },
        'myExperimentKey',
        callbacks,
      );

      const wrapper = mount(
        <ExperimentController experimentEnrollmentConfig={enrollmentConfig}>
          <OuterExperimentComponent />
        </ExperimentController>,
      );

      setTimeout(() => {
        wrapper.update();

        // should make the call to resolve outer experiment
        expect(enrollmentResolver).toBeCalled();
        // should make the call to resolve the inner experiment
        expect(enrollmentResolverTwo).toBeCalled();

        // make sure two experiments were rendered
        expect(wrapper.find(CohortTracker)).toHaveLength(2);
        // make sure the expected text is rendered
        expect(wrapper.text()).toEqual('variant');

        // there shouldnt be any errors
        expect(onError).not.toBeCalled();

        done();
      });
    });
  });
});
