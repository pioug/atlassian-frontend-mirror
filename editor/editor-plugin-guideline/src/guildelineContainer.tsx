/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';

import { Guideline } from './guideline';
import { GuidelineContainerArea as Areas, GuidelineConfig } from './types';

const guidelineContainerStyles = css({
  position: 'fixed',
  height: '100vh',
  width: '100%',
  display: 'grid',
  pointerEvents: 'none',
  border: 'none',
  maxWidth: `${akEditorFullWidthLayoutWidth}px`,
});

const guidelineSubContainerStyles = css({ position: 'relative' });

type ContainerProps = {
  guidelines: GuidelineConfig[];
  height: number;
  containerWidth: number;
  editorWidth: number;
};

type SubContainerProps = {
  containerId: string;
  guidelines: GuidelineConfig[];
};

const groupGuidelines = (guidelines: GuidelineConfig[]) =>
  guidelines.reduce(
    (acc, curr) => {
      const areaKey = curr.position.containerArea || Areas.EditorContent;
      const currentList = acc[areaKey];
      return { ...acc, [areaKey]: [...currentList, curr] };
    },
    {
      [Areas.EditorLeftMargin]: [] as GuidelineConfig[],
      [Areas.EditorContent]: [] as GuidelineConfig[],
      [Areas.EditorRightMargin]: [] as GuidelineConfig[],
    },
  );

const GuidelineSubContainer = (props: SubContainerProps) => (
  <div css={guidelineSubContainerStyles} data-container-id={props.containerId}>
    {props.guidelines.map(guideline => (
      <Guideline key={guideline.key} position={guideline.position} />
    ))}
  </div>
);

export const GuidelineContainer = (props: ContainerProps) => {
  const { guidelines, height, editorWidth } = props;

  if (guidelines.length === 0) {
    return null;
  }

  const guidelineGroups = groupGuidelines(guidelines);

  return (
    <div
      css={guidelineContainerStyles}
      style={{
        height,
        gridTemplateColumns: `[left] auto [editor] ${editorWidth}px [right] auto`,
      }}
      data-testid="guidelineContainer"
    >
      <GuidelineSubContainer
        containerId={Areas.EditorLeftMargin}
        guidelines={guidelineGroups[Areas.EditorLeftMargin]}
      />
      <GuidelineSubContainer
        containerId={Areas.EditorContent}
        guidelines={guidelineGroups[Areas.EditorContent]}
      />
      <GuidelineSubContainer
        containerId={Areas.EditorRightMargin}
        guidelines={guidelineGroups[Areas.EditorRightMargin]}
      />
    </div>
  );
};
