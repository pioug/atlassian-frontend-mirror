import { Component } from 'react';
import { ExposureDetails, ExperimentEnrollmentOptions } from './types';

interface Props {
  exposureDetails: ExposureDetails;
  onExposure: (
    exposureDetails: ExposureDetails,
    options?: ExperimentEnrollmentOptions,
  ) => void;
  options?: ExperimentEnrollmentOptions;
}

export default class CohortTracker extends Component<Props> {
  static displayName = 'CohortTracker';

  componentDidMount() {
    const { exposureDetails, options, onExposure } = this.props;
    onExposure(exposureDetails, options);
  }

  render() {
    return null;
  }
}
