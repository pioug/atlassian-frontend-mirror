/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import type { MarkProps } from '../types';

export const wrapperStyles = css({
  margin: `${blockNodesVerticalMargin} 0`,
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  marginLeft: '50%',
  transform: 'translateX(-50%)',
});

export default function Breakout(props: MarkProps<BreakoutMarkAttrs>) {
  return (
    <WidthConsumer>
      {({ width }) => (
        <div
          css={wrapperStyles}
          data-mode={props.mode}
          style={{ width: calcBreakoutWidth(props.mode, width) }}
          className="fabric-editor-breakout-mark fabric-editor-block-mark"
        >
          {props.children}
        </div>
      )}
    </WidthConsumer>
  );
}
