import React, { forwardRef, Ref } from 'react';

import { IconButton } from '../IconButton';

import { ProfileProps } from './types';

/**
 * __Profile__
 *
 * A profile button which takes an icon/avatar component can be that can be
 * passed into `AtlassianNavigation`'s `renderProfile` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#profile)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Profile = forwardRef<HTMLElement, ProfileProps>(
  (props: ProfileProps, ref: Ref<HTMLElement>) => {
    const { label: labelProp, tooltip } = props;
    const label =
      labelProp ||
      (typeof tooltip === 'string' ? tooltip : 'Your profile and settings');

    // All other implementations of IconButton within the components are using spread props, so
    // to use explicit props could cause regressions.
    // TODO: Remove these spread props for better static analysis
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    return (
      <div role="listitem">
        <IconButton label={label} ref={ref} {...props} />
      </div>
    );
  },
);

// This exists only to extract props.
// eslint-disable-next-line @repo/internal/react/use-noop
export default (props: ProfileProps) => {};
