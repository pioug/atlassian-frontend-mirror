/** @jsx jsx */
import { useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';

import { Guideline } from './guideline';
import { GuidelineConfig } from './types';

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
  centerOffset: number;
  containerWidth: number;
  editorWidth: number;
};

export const GuidelineContainer = (props: ContainerProps) => {
  const { guidelines, height, editorWidth, centerOffset } = props;
  const [offset, setOffset] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      // X pixels from guideline container left to editor center.
      setOffset(centerOffset - rect.x);
    }
  }, [centerOffset, guidelines, editorWidth]);

  return (
    <div
      ref={ref}
      css={guidelineContainerStyles}
      style={{
        height,
      }}
      data-testid="guidelineContainer"
    >
      {guidelines.map(guideline => {
        return (
          <Guideline
            key={guideline.key}
            position={guideline.position.x + offset}
            active={guideline.active}
            show={guideline.show}
            style={guideline.style}
          />
        );
      })}
    </div>
  );
};
