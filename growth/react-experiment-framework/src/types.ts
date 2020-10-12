export type ExperimentKey = string;

export type EnrollmentDetails = {
  cohort: string;
  isEligible: boolean;
  ineligibilityReasons?: string[];
};

export type ExperimentEnrollmentResolver = (
  options?: ExperimentEnrollmentOptions,
) => EnrollmentDetails | Promise<EnrollmentDetails>;

export type ExperimentDetails =
  | {
      isEnrollmentDecided: false;
      enrollmentResolver: ExperimentEnrollmentResolver;
    }
  | {
      isEnrollmentDecided: true;
      enrollmentDetails?: EnrollmentDetails;
    };

export type Experiments = {
  [experimentKey: string]: ExperimentDetails;
};

export type ExperimentEnrollmentConfig = {
  [experimentKey: string]: ExperimentEnrollmentResolver;
};

export type EnrollmentOptions = {
  [experimentKey: string]: any;
};

export type OptionsResolver = (
  experimentKey: ExperimentKey,
) => EnrollmentOptions;

export type ExperimentEnrollmentOptions = EnrollmentOptions | OptionsResolver;

export type ExperimentContext = {
  experiments: Experiments;
  options?: ExperimentEnrollmentOptions;
};

export type ExposureDetails = EnrollmentDetails & {
  experimentKey: ExperimentKey;
};

export type ResolverPromises = {
  [experimentKey: string]: Promise<EnrollmentDetails>;
};
