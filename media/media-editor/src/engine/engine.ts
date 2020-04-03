import * as Core from './core/binaries/mediaEditor';
import { ExportedImage, ShapeParameters, TextDirection, Tool } from '../common';
import { ResourceManager } from './resourceManager';

import { DrawingArea } from './components/drawingArea';
import { ImageProvider } from './components/imageProvider';
import { MouseInput } from './components/mouseInput';
import { Toolbar } from './components/toolbar';
import { InputCommand, KeyboardInput } from './components/keyboardInput';
import { ImageReceiver } from './components/imageReceiver';
import { ShapeDeleter } from './components/shapeDeleter';
import { UndoerRedoer } from './components/undoerRedoer';

import { BitmapExporter } from './core/bitmapExporter';
import { BitmapProvider } from './core/bitmaps/bitmapProvider';
import { BrowserTypesetter } from './core/typesetter/browserTypesetter';
import { ContextHolder } from './core/contextHolder';
import { TimerFactory } from './core/timerFactory';
import { hexToRgb, rgbToHex } from '../util';
import { DEFAULT_COLOR } from '../react/editorView/toolbar/popups/colorPopup';

export type CoreErrorHandler = (message: string) => void;

export interface EngineConfig {
  onCoreError: CoreErrorHandler;
  shapeParameters: ShapeParameters;
  initialTool: Tool;
  textDirection: TextDirection;
  drawingArea: DrawingArea;
  imageProvider: ImageProvider;
  mouseInput: MouseInput;
  toolbar: Toolbar;
  keyboardInput: KeyboardInput;
  imageReceiver: ImageReceiver;
  shapeDeleter: ShapeDeleter;
  undoerRedoer: UndoerRedoer;
}

const defaultFormat = 'image/png';
const maxColorChannel = 255;

export class Engine {
  private resourceManager = new ResourceManager();

  private module!: Core.NativeModule;
  private ve!: Core.VeEngine;
  private bitmapExporter!: BitmapExporter;

  constructor(private config: EngineConfig) {
    try {
      this.addComponentsToResourceManager();
      this.createNativeCore();
      this.subscribeToComponentsSignals();
    } catch (error) {
      this.resourceManager.releaseAll();
      throw error;
    }
  }

  unload(): void {
    this.resourceManager.releaseAll();
  }

  getBase64Image(format?: string): ExportedImage {
    try {
      if (!this.ve.exportImage()) {
        return { isExported: false, error: this.ve.failureReason };
      } else {
        const image = this.bitmapExporter.getBase64Image(
          format || defaultFormat,
        );
        const dimensions = this.bitmapExporter.getDimensions();
        return { isExported: true, content: image, dimensions };
      }
    } catch (error) {
      return { isExported: false, error: error.message };
    }
  }

  private addComponentsToResourceManager(): void {
    const {
      drawingArea: di,
      imageProvider: ip,
      mouseInput: mi,
      toolbar: tb,
      keyboardInput: ki,
      imageReceiver: ir,
      shapeDeleter: sd,
    } = this.config;

    [di, ip, mi, tb, ki, ir, sd].forEach(component =>
      this.resourceManager.add(component),
    );
  }

  private subscribeToComponentsSignals(): void {
    const {
      drawingArea,
      mouseInput,
      toolbar,
      keyboardInput,
      shapeDeleter,
      undoerRedoer,
    } = this.config;

    drawingArea.resize.listen(size => {
      this.veCall('resize', ve => ve.resize(size));
    });

    mouseInput.click.listen(pos =>
      this.veCall('click', ve => ve.clickOnce(pos)),
    );
    mouseInput.dragStart.listen(pos =>
      this.veCall('drag start', ve => ve.dragStart(pos)),
    );
    mouseInput.dragMove.listen(pos =>
      this.veCall('drag move', ve => ve.dragMove(pos)),
    );
    mouseInput.dragEnd.listen(pos =>
      this.veCall('drag end', ve => ve.dragEnd(pos)),
    );
    mouseInput.dragLost.listen(() =>
      this.veCall('drag lost', ve => ve.dragLost()),
    );

    toolbar.addShadowChanged.listen(() => {
      // TODO Inform the core about this change
      // https://jira.atlassian.com/browse/FIL-3997
    });
    toolbar.colorChanged.listen(color =>
      this.veCall('update color', ve => ve.setColor(hexToRgb(color))),
    );
    toolbar.lineWidthChanged.listen(lineWidth =>
      this.veCall('update line width', ve => ve.setLineWidth(lineWidth)),
    );
    toolbar.toolChanged.listen(tool =>
      this.veCall('update tool', ve => ve.setTool(this.toVeTool(tool))),
    );

    keyboardInput.characterPressed.listen(code =>
      this.veCall('add character', ve => ve.addCharacter(code)),
    );
    keyboardInput.inputCommand.listen(command =>
      this.veCall('input command', ve => {
        const textCommand = this.toTextCommand(command);
        return ve.textCommand(textCommand);
      }),
    );

    shapeDeleter.deleteShape.listen(() =>
      this.veCall('delete shape', ve => ve.deleteShape()),
    );
    undoerRedoer.undo.listen(() => {
      this.veCall('undo', ve => ve.undo());
    });
    undoerRedoer.redo.listen(() => {
      this.veCall('redo', ve => ve.redo());
    });
  }

  private createNativeCore(): void {
    this.module = Core.createModule();
    this.initModule();
    this.createVeEngine();
  }

  private initModule(): void {
    const {
      drawingArea,
      toolbar,
      keyboardInput,
      imageReceiver,
      shapeDeleter,
      undoerRedoer,
    } = this.config;

    const contextHolder = new ContextHolder(drawingArea);
    this.resourceManager.add(contextHolder);
    contextHolder.contextLost.listen(() => {
      this.veCall('context lost notification', ve => ve.contextLost());
    });
    contextHolder.contextRestored.listen(outputSize => {
      this.veCall('context restored notification', ve =>
        ve.contextRestored(outputSize),
      );
    });
    const gl = contextHolder.gl;
    this.module.setContext(gl);

    const bitmapProvider = new BitmapProvider(this.config.imageProvider, gl);
    this.resourceManager.add(bitmapProvider);
    this.module.bitmapProvider = bitmapProvider;

    this.module.handleShapeParametersChanged = (
      red: number,
      green: number,
      blue: number,
      lineWidth: number,
      addShadow: boolean,
    ) => {
      toolbar.updateByCore({
        color: rgbToHex({ red, green, blue }),
        lineWidth,
        addShadow,
      });
    };

    this.module.handleTextInputStarted = () => {
      keyboardInput.startInput();
    };
    this.module.handleTextInputEnded = () => {
      keyboardInput.endInput();
    };

    const typesetter = new BrowserTypesetter({
      // TODO: Media migration - TypeScript error - startInput not expected
      gl,
      module: this.module,
      ...(keyboardInput as any),
    });
    this.resourceManager.add(typesetter);
    this.module.browserTypesetter = typesetter;

    const timerFactory = new TimerFactory(id => this.passTimerTick(id));
    this.resourceManager.add(timerFactory);
    this.module.timerFactory = timerFactory;

    this.bitmapExporter = new BitmapExporter(
      imageReceiver.supplementaryCanvas,
      this.module,
    );
    this.module.bitmapExporter = this.bitmapExporter;

    this.module.handleScrollChanged = () => {};
    this.module.handleUndoRedoStateChanged = () => {};

    this.module.handleDeleteShapeStateChanged = (canDelete: boolean) => {
      if (canDelete) {
        shapeDeleter.deleteEnabled();
      } else {
        shapeDeleter.deleteDisabled();
      }
    };

    this.module.handleUndoRedoStateChanged = (canUndo, canRedo) => {
      if (canUndo) {
        undoerRedoer.undoEnabled();
      } else {
        undoerRedoer.undoDisabled();
      }
      if (canRedo) {
        undoerRedoer.redoEnabled();
      } else {
        undoerRedoer.redoDisabled();
      }
    };
  }

  private createVeEngine(): void {
    const { shapeParameters, drawingArea, imageProvider } = this.config;
    const { backImage, backImageUuid } = imageProvider;
    const color =
      typeof shapeParameters.color === 'string'
        ? shapeParameters.color
        : DEFAULT_COLOR;
    const initialParameters = {
      shapeColor: hexToRgb(color),
      lineWidth: shapeParameters.lineWidth,
      addShadow: shapeParameters.addShadow,
      tool: this.toVeTool(this.config.initialTool),
      windowSize: drawingArea.outputSize,
      backgroundColor: {
        alpha: maxColorChannel,
        ...drawingArea.backgroundColor,
      },
      backBitmapUuid: backImageUuid,
      backBitmapSize: { width: backImage.width, height: backImage.height },
      baseTextDirection: this.toTextDirection(this.config.textDirection),
    };

    this.ve = new this.module.VeEngine();
    this.resourceManager.addCustom(() => {
      this.ve.delete();
    });

    if (!this.ve.create(initialParameters)) {
      throw new Error(
        `The engine was not created. Error: ${this.ve.failureReason}`,
      );
    }

    this.veCall('render', ve => ve.render());
  }

  private veCall(
    description: string,
    method: (ve: Core.VeEngine) => boolean,
  ): void {
    if (!method(this.ve)) {
      this.config.onCoreError(
        `Could not perform '${description}'. Reason: '${this.ve.failureReason}'`,
      );
    }
  }

  private toVeTool(tool: Tool): Core.VeTool {
    const {
      Arrow,
      Blur,
      Line,
      Brush,
      Oval,
      Rectangle,
      Text,
    } = this.module.VeTool;

    const nativeTools = {
      arrow: Arrow,
      blur: Blur,
      line: Line,
      brush: Brush,
      oval: Oval,
      rectangle: Rectangle,
      text: Text,
      default: Arrow,
    };

    return nativeTools[tool] || nativeTools['default'];
  }

  private toTextCommand(inputCommand: InputCommand): Core.VeTextInputCommand {
    const {
      CompleteInput,
      NewLine,
      Backspace,
      Delete,
      MoveCursorLeft,
      MoveCursorRight,
      MoveCursorUp,
      MoveCursorDown,
    } = this.module.VeTextInputCommand;

    const commands = {
      complete: CompleteInput,
      newline: NewLine,
      backspace: Backspace,
      delete: Delete,
      left: MoveCursorLeft,
      right: MoveCursorRight,
      up: MoveCursorUp,
      down: MoveCursorDown,
    };

    return commands[inputCommand];
  }

  private toTextDirection(direction: TextDirection): Core.VeTextDirection {
    const { RightToLeft, LeftToRight } = this.module.VeTextDirection;
    return direction === 'rtl' ? RightToLeft : LeftToRight;
  }

  private passTimerTick(id: number): void {
    this.veCall('pass timer tick', ve => ve.timerTick(id));
  }
}
