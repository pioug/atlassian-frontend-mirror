export type EnabledHandles = { left?: boolean; right?: boolean };

export type Dimensions = {
  width: number;
  height: number;
};

export type HandleResize = (
  newWidth: { x: number; y: number } & Dimensions,
  delta: Dimensions,
) => void;

export type HandleStyles = {
  right?: React.CSSProperties;
  left?: React.CSSProperties;
};

export type HandleHeightSizeType = 'small' | 'medium' | 'large';

export type HandleAlignmentMethod = 'center' | 'sticky';

export type HandlePositioning = 'overlap' | 'adjacent';
