import React from 'react';
import { DataProviderProps, ResultComplete, Status } from './as-data-provider';

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type OptionalCloudId<U> = {
  cloudId?: string;
} & DataProviderProps<U>;

/**
 * Inject the ability to handle cases when cloudID is missing into the provided component.
 *
 * When cloud ID is available, this HOC will wrap {children} with the given provided component.
 * Otherwise, {children} is executed with the provided fallback result.
 *
 * @param ProviderComponent component to wrap
 * @param fallbackProviderResult result used to execute children if cloud id is missing
 *
 * @type P component props
 * @type U provider result type
 */
function withHandleOptionalCloudId<P extends DataProviderProps<U>, U>(
  ProviderComponent: React.ComponentType<P>,
  fallbackProviderResult: U,
) {
  return function (props: Overwrite<P, OptionalCloudId<U>>) {
    const { cloudId, children } = props;

    if (cloudId) {
      return (
        <ProviderComponent {...(props as P)}>{children}</ProviderComponent>
      );
    } else {
      const resultComplete: ResultComplete<U> = {
        status: Status.COMPLETE,
        data: fallbackProviderResult,
      };
      return <React.Fragment>{children(resultComplete)}</React.Fragment>;
    }
  };
}

export default withHandleOptionalCloudId;
