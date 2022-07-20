/**@jsx jsx */
import { jsx } from '@emotion/react';
import { dragZoneStyles } from './styles';

export const DragZone = ({
  showBorder,
  isDroppingFile,
  children,
  ...props
}: any) => (
  <div
    css={dragZoneStyles({
      showBorder: showBorder,
      isDroppingFile: isDroppingFile,
    })}
    {...props}
  >
    {children}
  </div>
);
