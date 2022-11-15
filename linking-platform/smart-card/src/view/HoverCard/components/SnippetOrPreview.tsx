import React, { useCallback, useState, useRef } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import extractPreview from '../../../extractors/flexible/extract-preview';
import {
  PreviewBlock,
  SnippetBlock,
} from '../../FlexibleCard/components/blocks';
import { getTransitionStyles } from '../styled';
import { SnippetOrPreviewProps } from '../types';

const SnippetOrPreview: React.FC<SnippetOrPreviewProps> = ({
  data,
  snippetHeight,
}) => {
  const transitionStarted = useRef<boolean>(false);
  const previewBlockRef = useRef<HTMLDivElement>(null);
  const [showSnippet, setShowSnippet] = useState<boolean>(false);
  const [previewCss, setPreviewCss] = useState<SerializedStyles>();

  // Set Preview to a fixed height to enable transitions
  const onPreviewRender = useCallback(() => {
    previewBlockRef.current &&
      setPreviewCss(css`
        height: ${previewBlockRef.current?.getBoundingClientRect().height}px;
      `);
  }, []);

  // On error set Preview to Snippet height with transition
  const onPreviewError = useCallback(() => {
    if (transitionStarted.current === false) {
      setPreviewCss(getTransitionStyles(snippetHeight));
      transitionStarted.current = true;
    }
  }, [snippetHeight]);

  const onPreviewTransitionEnd = useCallback(() => {
    setShowSnippet(true);
  }, []);

  return !showSnippet && data && extractPreview(data) ? (
    <PreviewBlock
      onError={onPreviewError}
      overrideCss={previewCss}
      onTransitionEnd={onPreviewTransitionEnd}
      blockRef={previewBlockRef}
      onRender={onPreviewRender}
    />
  ) : (
    <SnippetBlock />
  );
};

export default SnippetOrPreview;
