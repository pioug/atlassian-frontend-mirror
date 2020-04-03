import React from 'react';

import ItemsRenderer from '../../../renderer';
import SkeletonContainerView from '../../presentational/SkeletonContainerView';
import AsyncLayoutManagerWithViewController from '../AsyncLayoutManagerWithViewController';
/* NOTE: experimental props use an underscore */
/* eslint-disable camelcase */

const LayoutManagerWithViewController = ({
  children,
  firstSkeletonToRender,
  customComponents,
  experimental_alternateFlyoutBehaviour,
  experimental_flyoutOnHover,
  experimental_fullWidthFlyout,
  experimental_hideNavVisuallyOnCollapse,
  experimental_horizontalGlobalNav,
  globalNavigation,
  onExpandStart,
  onExpandEnd,
  onCollapseStart,
  onCollapseEnd,
  getRefs,
  topOffset,
  shouldHideGlobalNavShadow,
  showContextualNavigation,
}) => {
  return (
    <AsyncLayoutManagerWithViewController
      onExpandStart={onExpandStart}
      onExpandEnd={onExpandEnd}
      onCollapseStart={onCollapseStart}
      onCollapseEnd={onCollapseEnd}
      getRefs={getRefs}
      customComponents={customComponents}
      experimental_flyoutOnHover={!!experimental_flyoutOnHover}
      experimental_alternateFlyoutBehaviour={
        !!experimental_alternateFlyoutBehaviour
      }
      experimental_hideNavVisuallyOnCollapse={
        !!experimental_hideNavVisuallyOnCollapse
      }
      experimental_fullWidthFlyout={!!experimental_fullWidthFlyout}
      experimental_horizontalGlobalNav={!!experimental_horizontalGlobalNav}
      globalNavigation={globalNavigation}
      containerSkeleton={() =>
        firstSkeletonToRender ? (
          <SkeletonContainerView type={firstSkeletonToRender} />
        ) : null
      }
      itemsRenderer={ItemsRenderer}
      firstSkeletonToRender={firstSkeletonToRender}
      topOffset={topOffset}
      shouldHideGlobalNavShadow={shouldHideGlobalNavShadow}
      showContextualNavigation={showContextualNavigation}
    >
      {children}
    </AsyncLayoutManagerWithViewController>
  );
};

export default LayoutManagerWithViewController;
