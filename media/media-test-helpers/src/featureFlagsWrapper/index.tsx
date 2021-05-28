import React, { useState, FC } from 'react';
import FeatureFlagsDropdown from './dropdown';
import { MediaFeatureFlags } from '@atlaskit/media-common';

const isLocalStorageSupported = () => {
  try {
    if (typeof window !== 'undefined' && !!window.localStorage) {
      //we try accessing localStorage
      localStorage.getItem('some-key');
      return true;
    }
  } catch (e) {}
  return false;
};

export type FeatureFlagsWrapperProps = {
  filterFlags?: Array<keyof MediaFeatureFlags>;
};

const FeatureFlagsWrapper: FC<FeatureFlagsWrapperProps> = ({
  children,
  filterFlags,
}) => {
  const [childrenKey, setChildrenKey] = useState(0);
  // This is a trick to force a re-render on the component's children to see the new FF values taking effect
  const onFlagChanged = () => {
    setChildrenKey(childrenKey + 1);
  };
  return isLocalStorageSupported() ? (
    <>
      <FeatureFlagsDropdown
        onFlagChanged={onFlagChanged}
        filterFlags={filterFlags}
      />
      <React.Fragment key={childrenKey}>{children}</React.Fragment>
    </>
  ) : (
    <>{children}</>
  );
};

export default FeatureFlagsWrapper;
