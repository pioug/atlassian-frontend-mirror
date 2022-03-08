import { useEffect, useRef } from 'react';
import { CustomData, UFOExperience } from '@atlaskit/ufo';
import { withSampling } from './samplingUfo';

const useConstructor = (callback: () => void) => {
  const hasBeenFired = useRef(false);
  if (!hasBeenFired.current) {
    callback();
    hasBeenFired.current = true;
  }
  return null;
};

/**
 * A hook to start an experience and to auto abort the experience when the parent component is unmounted.
 * Use this instead of a direct call to `experience.start`. If you need to restart the experience
 * simply trigger an unmount and remount of the parent component.
 * @param experience the experience to start and abort
 */
export const useSampledUFOComponentExperience = (
  experience: UFOExperience,
  samplingRate: number,
  metadata?: CustomData,
) => {
  useEffect(() => {
    return () => {
      withSampling(experience).abort();
    };
    // we want this cleanup to only happen on unmount so this is a legit use of empty array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useConstructor(() => {
    withSampling(experience).start({ samplingRate });
    if (metadata) {
      experience.addMetadata(metadata);
    }
  });
  return null;
};
