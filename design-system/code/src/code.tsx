/** @jsx jsx */
import React, { forwardRef, memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';

import CodeBidiWarning from './bidi-warning';
import codeBidiWarningDecorator from './bidi-warning/bidi-warning-decorator';
import { getCodeStyles } from './internal/theme/styles';
import type { CodeProps } from './types';

/**
 * __Code__
 *
 * Code highlights short strings of code snippets inline with body text.
 *
 * - [Examples](https://atlassian.design/components/code/examples)
 * - [Code](https://atlassian.design/components/code/code)
 * - [Usage](https://atlassian.design/components/code/usage)
 */
const Code = memo(
  forwardRef<HTMLElement, CodeProps>(function Code({ testId, ...props }, ref) {
    const theme = useGlobalTheme();
    const styles = useMemo(() => getCodeStyles(theme), [theme]);
    const {
      children,
      codeBidiWarnings = true,
      codeBidiWarningLabel,
      codeBidiWarningTooltipEnabled = true,
      ...otherProps
    } = props;

    const decoratedChildren = codeBidiWarnings ? (
      <RenderCodeChildrenWithBidiWarnings
        codeBidiWarningLabel={codeBidiWarningLabel}
        codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
      >
        {children}
      </RenderCodeChildrenWithBidiWarnings>
    ) : (
      children
    );
    return (
      <code ref={ref} data-testid={testId} css={styles} {...otherProps}>
        {decoratedChildren}
      </code>
    );
  }),
);

function RenderCodeChildrenWithBidiWarnings({
  children,
  codeBidiWarningLabel,
  codeBidiWarningTooltipEnabled,
}: {
  children: React.ReactNode;
  codeBidiWarningLabel?: string;
  codeBidiWarningTooltipEnabled: boolean;
}) {
  const replacedChildren = React.Children.map(children, (childNode) => {
    if (typeof childNode === 'string') {
      const decorated = codeBidiWarningDecorator(
        childNode,
        ({ bidiCharacter, index }) => (
          <CodeBidiWarning
            bidiCharacter={bidiCharacter}
            key={index}
            label={codeBidiWarningLabel}
            tooltipEnabled={codeBidiWarningTooltipEnabled}
          />
        ),
      );
      return decorated;
    }

    if (isReactElement(childNode) && childNode.props.children) {
      // eslint-disable-next-line @repo/internal/react/no-clone-element
      const newChildNode = React.cloneElement(childNode as JSX.Element, {
        children: (
          <RenderCodeChildrenWithBidiWarnings
            codeBidiWarningLabel={codeBidiWarningLabel}
            codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
          >
            {childNode.props.children}
          </RenderCodeChildrenWithBidiWarnings>
        ),
      });
      return newChildNode;
    }

    return childNode;
  });

  return <React.Fragment>{replacedChildren}</React.Fragment>;
}

function isReactElement<P>(
  child: React.ReactNode,
): child is React.ReactElement<P> {
  return !!(child as React.ReactElement<P>).type;
}

Code.displayName = 'Code';

export { getCodeStyles };

export default Code;
