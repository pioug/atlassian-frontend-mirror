import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { N50, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const Wrapper = styled.div`
  display: flex;
`;

export default () => {
  const [isMouseHovered, setHoverState] = useState(false);
  const onMouseEnter = useCallback(() => setHoverState(true), [setHoverState]);
  const onMouseLeave = useCallback(() => setHoverState(false), [setHoverState]);

  return (
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <EditorPanelIcon
        testId="source-icon"
        label=""
        size="large"
        primaryColor={token(
          'color.text.lowEmphasis',
          isMouseHovered ? N200 : N50,
        )}
      />
    </Wrapper>
  );
};
