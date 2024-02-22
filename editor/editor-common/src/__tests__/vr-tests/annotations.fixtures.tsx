/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { AnnotationSharedCSSByState } from '../../styles/shared/annotation';

const focusStyle = css(AnnotationSharedCSSByState().focus);
const blurStyle = css(AnnotationSharedCSSByState().blur);

export const AnnotationFocused = () => {
  return <span css={focusStyle}>SOME TEXT ANNOTATED</span>;
};

export const AnnotationBlur = () => {
  return <span css={blurStyle}>SOME TEXT ANNOTATED</span>;
};
