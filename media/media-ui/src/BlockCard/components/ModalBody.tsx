import React from 'react';

export const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  return (
    <div ref={ref} style={{ height: '100%' }}>
      {children}
    </div>
  );
});
