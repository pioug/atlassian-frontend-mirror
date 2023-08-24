/** @jsx jsx */
import { useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';

import { VAR_POSITION_OFFSET_X, VAR_POSITION_OFFSET_Y } from './constants';
import { Guideline } from './guideline';
import type { GuidelineConfig, GuidelineContainerRect } from './types';

const guidelineContainerStyles = css({
  position: 'fixed',
  height: '100vh',
  width: '100%',
  display: 'grid',
  pointerEvents: 'none',
  border: 'none',
  maxWidth: `${akEditorFullWidthLayoutWidth}px`,
});

type ContainerProps = {
  guidelines: GuidelineConfig[];
  height: number;
  width: number;
  editorWidth: number;
  updateRect: (rect: GuidelineContainerRect) => void;
};

export const GuidelineContainer = (props: ContainerProps) => {
  const { guidelines, height, updateRect } = props;
  const [offset, setOffset] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      const centerOffset = rect.width / 2 - 0.5;

      // X pixels from guideline container left to editor center.
      if (offset !== centerOffset) {
        setOffset(centerOffset);
      }

      updateRect({ top: rect.top, left: rect.left });
    }
  }, [updateRect, offset]);

  const style = {
    [VAR_POSITION_OFFSET_X]: `${offset}px`,
    [VAR_POSITION_OFFSET_Y]: `0px`,
    height,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      css={guidelineContainerStyles}
      style={style}
      data-testid="guidelineContainer"
    >
      {guidelines.map(guideline => {
        const { key, ...guidelineProps } = guideline;

        return <Guideline key={key} {...guidelineProps} />;
      })}
    </div>
  );
};
