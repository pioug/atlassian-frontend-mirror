import React, { useContext } from 'react';

import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Spinner from '@atlaskit/spinner';

import { withNavigationViewController } from '../../../view-controller';
import { ScrollProviderRef } from '../../presentational/ContentNavigation/primitives';
import ConnectedItem from '../ConnectedItem';

const After = ({
  afterGoTo,
  spinnerDelay,
  incomingView,
  isActive,
  isHover,
  isFocused,
}) => {
  if (incomingView && incomingView.id === afterGoTo) {
    return <Spinner delay={spinnerDelay} invertColor size="small" />;
  }
  if (isActive || isHover || isFocused) {
    return (
      <ArrowRightCircleIcon
        primaryColor="currentColor"
        secondaryColor="inherit"
      />
    );
  }
  return null;
};

const GoToItem = (gotoItemProps) => {
  const scrollProviderRef = useContext(ScrollProviderRef);
  const spinnerDelay = gotoItemProps.spinnerDelay || 200;

  const handleClick = (
    // eslint-disable-next-line no-undef
    e,
  ) => {
    const { goTo, navigationViewController } = gotoItemProps;

    e.preventDefault();
    if (typeof goTo !== 'string') {
      return;
    }
    // Hijack focus only if the event is
    // from a keyboard.
    if (e.clientX === 0 && e.clientY === 0 && scrollProviderRef.current) {
      scrollProviderRef.current.focus();
    }

    navigationViewController.setView(goTo);
  };

  const {
    after: afterProp,
    goTo,
    navigationViewController,
    ...rest
  } = gotoItemProps;

  const after = typeof afterProp === 'undefined' ? After : afterProp;
  const propsForAfterComp = {
    afterGoTo: goTo || null,
    spinnerDelay,
    incomingView: navigationViewController.state.incomingView,
  };

  const props = { ...rest, after };

  return (
    <ConnectedItem onClick={handleClick} {...props} {...propsForAfterComp} />
  );
};

export { GoToItem as GoToItemBase };
export default withNavigationViewController(GoToItem);
