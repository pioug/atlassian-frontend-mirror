/**
 * Cropper transformation data
 */
export interface CropperTransform {
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  width: number;
  x: number;
  y: number;
}

/**
 * Cropper selection bounds
 */
export interface CropperBounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

// Cast to avoid SSR issues
type HTMLImageElementBase = typeof HTMLImageElement extends {prototype: infer T} ? T : Record<string, unknown>;
type HTMLElementBase = typeof HTMLElement extends {prototype: infer T} ? T : Record<string, unknown>;

/**
 * Cropper image element
 */
export interface CropperImageElement extends HTMLImageElementBase {
  $ready: (callback?: () => void) => Promise<CropperImageElement>;
  $scale: (x: number, y: number) => void;
  transform?: Partial<CropperTransform>;
}

/**
 * Cropper canvas element properties
 */
export interface CropperCanvasElement extends HTMLElementBase {
  $reset: () => void;
  alt?: string;
  background?: boolean;
  // Methods
  getCropperImage: () => CropperImageElement | null;
  rotatable?: boolean;
  scalable?: boolean;
  setCropperImage: (image: CropperImageElement) => void;
  src?: string;
  translatable?: boolean;
}

/**
 * Cropper selection element properties
 * Based on CropperJS 2.x actual API
 */
export interface CropperSelectionElement extends HTMLElementBase {
  // Methods (prefixed with $)
  $center: () => CropperSelectionElement;
  $change: (x: number, y: number, width?: number, height?: number, aspectRatio?: number) => CropperSelectionElement;
  $clear: () => CropperSelectionElement;
  $move: (x: number, y?: number) => CropperSelectionElement;
  $moveTo: (x: number, y?: number) => CropperSelectionElement;
  $reset: () => CropperSelectionElement;
  $resize: (action: string, offsetX?: number, offsetY?: number, aspectRatio?: number) => CropperSelectionElement;
  $toCanvas: (options?: {
    beforeDraw?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
    height?: number;
    width?: number;
  }) => Promise<HTMLCanvasElement>;
  $zoom: (scale: number, x?: number, y?: number) => CropperSelectionElement;
  active: boolean;
  aspectRatio: number;
  dynamic: boolean;
  height: number;
  initialAspectRatio: number;
  initialCoverage: number;
  keyboard: boolean;
  linked: boolean;
  movable: boolean;
  multiple: boolean;
  outlined: boolean;
  precise: boolean;
  resizable: boolean;
  width: number;
  // Properties (direct access)
  x: number;
  y: number;
  zoomable: boolean;
}

/**
 * Cropper event detail
 */
export interface CropperEventDetail {
  action?: string;
  bounds?: CropperBounds;
  transform?: CropperTransform;
}

/**
 * Custom cropper event
 */
export interface CropperEvent extends CustomEvent<CropperEventDetail> {
  readonly detail: CropperEventDetail;
}

/**
 * Event handler types
 */
export type CropperEventHandler = (event: CropperEvent) => void;