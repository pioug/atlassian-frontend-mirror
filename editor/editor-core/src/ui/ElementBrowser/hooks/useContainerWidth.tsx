import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { WidthObserver } from '@atlaskit/width-detector';

/**
 *
 * Problem:
 * While using WidthObserver, there's no initial width.
 * That may cause problems, but not limited to, something like a lag between
 * renders for conditionally rendered components.
 *
 * solution:
 * useContainerWidth() hook
 * it pre-measures the width of a parent container on initial mount
 * and gives you back the containerWidth.
 *
 *
 * Example hook usage:
 *
 *  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
 *
 *  return (
 *   <>
 *    <ContainerWidthMonitor />
 *    {containerWidth < 600 ? <MobileComponent /> : <DesktopComponent />}
 *   </>
 *  );
 *
 */

type useContainerWidthReturnType = {
  containerWidth: number;
  ContainerWidthMonitor: React.ElementType;
};

export default function useContainerWidth(): useContainerWidthReturnType {
  const [containerWidth, setContainerWidth] = useState(0);

  const ref = useCallback(node => {
    if (node != null) {
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const ContainerWidthMonitor = () => {
    return (
      <WidthObserverWrapper innerRef={ref}>
        <WidthObserver setWidth={setContainerWidth} />
      </WidthObserverWrapper>
    );
  };
  return { containerWidth, ContainerWidthMonitor };
}

const WidthObserverWrapper = styled.div`
  position: relative;
`;
WidthObserverWrapper.displayName = 'WidthObserverWrapper';
