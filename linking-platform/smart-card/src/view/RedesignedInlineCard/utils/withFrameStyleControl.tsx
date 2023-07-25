import React from 'react';
import { token } from '@atlaskit/tokens';
import { themed } from '@atlaskit/theme/components';
import { N500, N40 } from '@atlaskit/theme/colors';

/**
 * This HOC serves as a temporary workaround for controlling the style of a parent component.
 * We do not want the Frame to have a hover state when hovering over the action button.
 * TODO: When Firefox begins supporting the :has()pseudo-selector (e.g "frame:has(button:hover){...}"),
 * it should be used instead and the code should be cleaned up.
 */
export default (Button: any, frameRef: React.RefObject<HTMLSpanElement>) =>
  (props: any) => {
    const setBorderStyle = () => {
      const borderColor = themed({
        light: `${token('color.border.input', N40)}`,
        dark: `${token('color.border.input', N500)}`,
      })();

      const frameNode = frameRef.current;
      if (frameNode) {
        frameNode.style.borderColor = borderColor;
      }
    };

    const removeBorderStyle = () => {
      const frameNode = frameRef.current;
      if (frameNode) {
        frameNode.removeAttribute('style');
      }
    };

    return (
      <Button
        {...props}
        onMouseEnter={setBorderStyle}
        onMouseLeave={removeBorderStyle}
      />
    );
  };
