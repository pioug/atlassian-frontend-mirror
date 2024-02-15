/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * Conditional wrapper for the ValueContainer in Select. Provides a workaround
 * for issues using react-select on react-beautiful-dnd Draggable elements.
 * @returns
 */
const ValueContainerWrapper = ({
  children,
  isEnabled,
  onMouseDown,
}: {
  children: React.ReactElement;
  isEnabled: boolean;
  onMouseDown: () => void;
}) => {
  return isEnabled ? (
    <div css={css({ flexGrow: 1 })} onMouseDown={onMouseDown}>
      {children}
    </div>
  ) : (
    children
  );
};

export default ValueContainerWrapper;
