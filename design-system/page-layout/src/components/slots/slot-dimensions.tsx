import React from 'react';

interface SlotDimensionsProps {
  variableName: string;
  value?: number;
}
export default ({ variableName, value }: SlotDimensionsProps) => (
  <style>{`:root{--${variableName}:${value}px;}`}</style>
);
