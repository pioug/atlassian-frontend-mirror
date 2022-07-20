/** @jsx jsx */
import { Fragment, memo } from 'react';
import { lazy, Suspense } from 'react';
import { jsx } from '@emotion/react';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { useFeatureFlags } from '../../../use-feature-flags';
import { useInViewport } from '../../hooks/use-in-viewport';
import { useBidiWarnings } from '../../hooks/use-bidi-warnings';
import type { Props as CodeBlockProps } from './codeBlock';
import LightWeightCodeBlock from './components/lightWeightCodeBlock';
import CodeBlockContainer from './components/codeBlockContainer';

const LazyAkCodeBlock = lazy(
  async () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_renderer-codeBlock" */
      '@atlaskit/code/block'
    ),
);

const joinWithSpaces = (...strs: (string | undefined)[]): string =>
  strs.join(' ');

const MemoizedLightWeightCodeBlock = memo(LightWeightCodeBlock);

const WindowedCodeBlock = ({
  text,
  language,
  allowCopyToClipboard,
  codeBidiWarningTooltipEnabled,
  className: rootClassName,
}: CodeBlockProps) => {
  const featureFlags = useFeatureFlags();
  const { warningLabel } = useBidiWarnings({
    enableWarningTooltip: codeBidiWarningTooltipEnabled,
  });
  const { isInViewport, trackingRef } = useInViewport<HTMLDivElement>();
  const className = joinWithSpaces(
    CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
    rootClassName,
  );

  const memoizedLightWeightCodeBlock = (
    <MemoizedLightWeightCodeBlock
      ref={trackingRef}
      text={text}
      codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
      className={rootClassName}
    />
  );

  return isInViewport ? (
    <Fragment>
      <Suspense fallback={memoizedLightWeightCodeBlock}>
        <CodeBlockContainer
          className={className}
          text={text}
          allowCopyToClipboard={allowCopyToClipboard}
        >
          <LazyAkCodeBlock
            language={language}
            text={text}
            codeBidiWarnings={featureFlags?.codeBidiWarnings}
            codeBidiWarningLabel={warningLabel}
            codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
          />
        </CodeBlockContainer>
      </Suspense>
    </Fragment>
  ) : (
    memoizedLightWeightCodeBlock
  );
};

export default WindowedCodeBlock;
