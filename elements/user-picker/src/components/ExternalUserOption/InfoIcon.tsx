/** @jsx jsx */
import { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/react';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { N50, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const wrapper = css({
  display: 'flex',
});

export default () => {
  const [isMouseHovered, setHoverState] = useState(false);
  const onMouseEnter = useCallback(() => setHoverState(true), [setHoverState]);
  const onMouseLeave = useCallback(() => setHoverState(false), [setHoverState]);

  return (
    <div css={wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <EditorPanelIcon
        testId="source-icon"
        label=""
        size="large"
        primaryColor={token('color.text.subtlest', isMouseHovered ? N200 : N50)}
      />
    </div>
  );
};
