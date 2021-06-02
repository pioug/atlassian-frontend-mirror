import { Fragment, FragmentPosition } from './fragment';
import { FontInfo } from './fontInfo';
import { TextDirection } from '../../../common';

export interface TextRenderingConfig {
  text: string;
  direction: TextDirection;
  fontSize: number;
  fontInfo: FontInfo;
  supplementaryCanvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
}

// Measures to render the text on a canvas.
interface TextMeasures {
  width: number;
  height: number;
  x: number;
  y: number; // measured from the top as on the canvas context
  yoffset: number;
  descent: number; // necessary to calculate text y position
}

// One generated texture: either for the normal text or stroke
interface GeneratedTexture {
  texture: WebGLTexture | null;
  position: FragmentPosition;
}

// Function that is responsbile for rendering text on canvas
type TextRenderer = (
  text: string,
  context: CanvasRenderingContext2D,
  measures: TextMeasures,
  strokeThickness: number,
) => void;

// Renders one line of the text. Pushes new fragments to the 'fragments' array
export const renderText = (
  fragments: Array<Fragment>,
  config: TextRenderingConfig,
): boolean => {
  const { direction, supplementaryCanvas: canvas, gl } = config;

  const measures = measureText(config);
  if (!measures) {
    return false;
  }

  setCanvasSize(canvas, measures);
  const previousDirection = setCanvasDir(canvas, direction);
  const normalTextures = generateTextures(config, measures, renderNormalText);
  const strokeTextures = generateTextures(config, measures, renderStroke);
  canvas.dir = previousDirection; // restore text direction

  // We need to check the generated textures. Their amount must be the same and all of them must be valid
  const generationCompleted =
    normalTextures.length === strokeTextures.length &&
    normalTextures.every((tex) => !!tex.texture) &&
    strokeTextures.every((tex) => !!tex.texture);
  if (!generationCompleted) {
    // An unexpected error occured. We should delete all the textures and return false
    deleteTextures(gl, normalTextures);
    deleteTextures(gl, strokeTextures);
    return false;
  }

  // Combine the generated textures for the normal text and stroke. They have the same positions
  normalTextures.forEach((generatedNormal, index) => {
    const generatedStroke = strokeTextures[index];

    const normal = generatedNormal.texture;
    const stroke = generatedStroke.texture;
    const position = generatedNormal.position;

    if (normal && stroke) {
      fragments.push(new Fragment(gl, normal, stroke, position));
    }
  });

  return true;
};

// Gets measures of the text that should be rendered
const measureText = (config: TextRenderingConfig): TextMeasures | null => {
  const { text, direction, fontSize, fontInfo, supplementaryCanvas } = config;

  // We will use '2d' context of the canvas to measure the text
  const context = supplementaryCanvas.getContext('2d');
  if (!context) {
    return null;
  }

  // Firstly we will detect the "pure" width and height of the text, without any offsets.
  const fontMetrics = fontInfo.getFontMetrics(fontSize);
  context.font = FontInfo.getFontStyle(fontSize);
  const pureWidth = context.measureText(text).width;
  const pureHeight = fontMetrics.lineHeight;

  // "Pure" width and height are rough values, estimations.
  // If we apply them directly, we can have our rendered text clipped. Thus we will add some offset.
  // Offset value was adjusted manually.
  // Also "pure" width and height don't consider stroke thickness, we need to add it as well.
  const strokeThickness = getStrokeThickness(fontSize);
  const offset = Math.round(Math.min(fontSize / 2, 5)) + strokeThickness;
  const width = Math.round(offset + pureWidth + offset);
  const height = Math.round(offset + pureHeight + offset);

  // If the direction is right-to-left, the text starts at the rightmost position
  const x = Math.round(direction === 'rtl' ? width - offset : offset);
  const y = Math.round(height - offset); // y on canvas context is measured from the top
  return { width, height, x, y, yoffset: offset, descent: fontMetrics.descent };
};

// Gets the thickness of the stroke depending on the font size.
// The numbers were adjusted manually.
const getStrokeThickness = (fontSize: number): number => {
  return Math.round(Math.max(fontSize / 12, 2));
};

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  measures: TextMeasures,
): void => {
  canvas.width = measures.width;
  canvas.height = measures.height;
};

// Sets canvas diretion, returns the previous direction
const setCanvasDir = (
  canvas: HTMLCanvasElement,
  textDirection: TextDirection,
): string => {
  const previousDirection = canvas.dir;
  canvas.dir = textDirection;
  return previousDirection;
};

// Renders the text on the canvas and gets textures containing the rendered text.
// Rendering the normal text and stroke differs only in the text rendering. You should pass this function
// in the 'renderer' parameter.
//
// Also note that we need alpha textures as the result, where pixel 0 is transparent, 255 - opaque.
// Thus we will render white text on the black canvas. Then when we can copy any channel (R, G, or B) to the result texture.
const generateTextures = (
  config: TextRenderingConfig,
  measures: TextMeasures,
  renderer: TextRenderer,
): Array<GeneratedTexture> => {
  const { text, fontSize, gl, supplementaryCanvas: canvas } = config;

  const context = canvas.getContext('2d');
  if (!context) {
    return [];
  }

  clearCanvas(context, canvas);
  context.font = FontInfo.getFontStyle(fontSize);
  context.textBaseline = 'bottom';
  renderer(text, context, measures, getStrokeThickness(fontSize));
  return sliceCanvasToTextures(context, gl, measures);
};

const renderNormalText = (
  text: string,
  context: CanvasRenderingContext2D,
  measures: TextMeasures,
): void => {
  context.fillStyle = '#FFFFFF';
  context.fillText(text, measures.x, measures.y);
};

const renderStroke = (
  text: string,
  context: CanvasRenderingContext2D,
  measures: TextMeasures,
  strokeThickness: number,
): void => {
  context.lineJoin = 'round';
  context.strokeStyle = '#FFFFFF';
  // The stroke consists of two parts: the inner and outer, both are rendered with equal thickness: context.lineWidth / 2 each.
  // We need the outer stroke rendered with strokeThickness, thus we need to set context.lineWidth to (2 * strokeThickness).
  context.lineWidth = 2 * strokeThickness;
  context.strokeText(text, measures.x, measures.y);
};

const clearCanvas = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): void => {
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

// Produces multiple alpha textures from the canvas with the rendered text.
// Slices the canvas horizontally.
const sliceCanvasToTextures = (
  context: CanvasRenderingContext2D,
  gl: WebGLRenderingContext,
  measures: TextMeasures,
): Array<GeneratedTexture> => {
  const result: Array<GeneratedTexture> = [];
  const maxTextureSize = gl.MAX_TEXTURE_SIZE;

  // We include descent to the offset because we used context.textBaseline = 'bottom' for rendering
  // but for the fragment y = 0 at the base line.
  const yoffset = measures.yoffset + measures.descent;

  for (let x = 0; x < measures.width; x += maxTextureSize) {
    const xend = Math.min(x + maxTextureSize, measures.width);

    result.push({
      texture: createTexture(context, gl, x, xend, measures.height),
      position: {
        xbase: x - measures.x,
        ybase: -yoffset,
        xopposite: xend - measures.x,
        yopposite: measures.height - yoffset,
      },
    });
  }

  return result;
};

const createTexture = (
  context: CanvasRenderingContext2D,
  gl: WebGLRenderingContext,
  xstart: number,
  xend: number,
  height: number,
): WebGLTexture | null => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // These parameters are required for non-power-of-two textures (according to WebGL spec)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const previousAlignment = gl.getParameter(gl.UNPACK_ALIGNMENT);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  const width = xend - xstart;
  const bufferLength = width * height;
  const buffer = new Uint8Array(bufferLength);

  // Copy the region from canvas
  const canvasData = context.getImageData(xstart, 0, width, height);
  for (let i = 0; i < canvasData.data.length; i += 4) {
    buffer[i / 4] = canvasData.data[i]; // we take the R channel
  }

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.ALPHA,
    width,
    height,
    0,
    gl.ALPHA,
    gl.UNSIGNED_BYTE,
    buffer,
  );

  gl.pixelStorei(gl.UNPACK_ALIGNMENT, previousAlignment);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
};

const deleteTextures = (
  gl: WebGLRenderingContext,
  textures: Array<GeneratedTexture>,
): void => {
  textures.forEach((gen) => {
    if (gen.texture) {
      gl.deleteTexture(gen.texture);
    }
  });
};
