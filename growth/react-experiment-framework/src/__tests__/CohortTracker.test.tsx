import React from 'react';
import { shallow } from 'enzyme';

import CohortTracker from '../CohortTracker';
import { ExposureDetails, EnrollmentOptions } from '../types';

describe('CohortTracker', () => {
  let mockExposureDetails: ExposureDetails;
  let mockEnrollmentOptions: EnrollmentOptions;
  let mockOnExposure: () => void;

  beforeEach(() => {
    mockExposureDetails = {
      cohort: 'control',
      experimentKey: 'myExperimentKey',
      isEligible: true,
    };
    mockEnrollmentOptions = {
      example: 'value',
    };

    mockOnExposure = jest.fn();
  });

  it('should call onExposure when mounted', () => {
    shallow(
      <CohortTracker
        exposureDetails={mockExposureDetails}
        options={mockEnrollmentOptions}
        onExposure={mockOnExposure}
      />,
    );

    expect(mockOnExposure).toBeCalledWith(
      mockExposureDetails,
      mockEnrollmentOptions,
    );
  });

  it('should not have a presence in the dom', () => {
    const wrapper = shallow(
      <CohortTracker
        exposureDetails={mockExposureDetails}
        onExposure={mockOnExposure}
      />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });
});
