export type EnabledHandles = { left?: boolean; right?: boolean };

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};
export type Snap = {
  x?: Array<number>;
  y?: Array<number>;
};

export type HandleResize = (
  newWidth: Position & Dimensions,
  delta: Dimensions,
) => void;

export type HandleResizeStart = () => void;

export type HandleStyles = {
  right?: React.CSSProperties;
  left?: React.CSSProperties;
};

export type HandleHeightSizeType = 'small' | 'medium' | 'large';

export type HandleAlignmentMethod = 'center' | 'sticky';

export type HandlePositioning = 'overlap' | 'adjacent';

export type ResizerAppearance = 'danger';
export type HandleHighlight = 'none' | 'shadow';
