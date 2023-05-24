export type EnabledHandles = { left?: boolean; right?: boolean };

export type HandleResize = (
  newWidth: { x: number; y: number; width: number; height: number },
  delta: { width: number; height: number },
) => number;

export type HandleStyles = {
  right?: React.CSSProperties;
  left?: React.CSSProperties;
};

export type HandlerHeightSizeType = 'small' | 'medium' | 'large';
