/** @jsx jsx */
import { Fragment, lazy, memo, Suspense, useState } from 'react';
import { jsx } from '@emotion/react';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

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
  allowWrapCodeBlock = false,
  codeBidiWarningTooltipEnabled,
  className: rootClassName,
}: CodeBlockProps) => {
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={rootClassName}
    />
  );

  const [wrapLongLines, setWrapLongLines] = useState<boolean>(false);

  return isInViewport ? (
    <Fragment>
      <Suspense fallback={memoizedLightWeightCodeBlock}>
        <CodeBlockContainer
          allowCopyToClipboard={allowCopyToClipboard}
          allowWrapCodeBlock={allowWrapCodeBlock}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          className={className}
          setWrapLongLines={setWrapLongLines}
          text={text}
          wrapLongLines={wrapLongLines}
        >
          <LazyAkCodeBlock
            language={language}
            text={text}
            codeBidiWarningLabel={warningLabel}
            codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
            shouldWrapLongLines={allowWrapCodeBlock && wrapLongLines}
          />
        </CodeBlockContainer>
      </Suspense>
    </Fragment>
  ) : (
    memoizedLightWeightCodeBlock
  );
};

export default WindowedCodeBlock;
