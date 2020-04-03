jest.mock('../../platformDetector');
import { DefaultUndoerRedoer, UndoerRedoer } from '../../undoerRedoer';
import { isMac, isWindows } from '../../platformDetector';
import { asMock } from '@atlaskit/media-test-helpers';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

const createEvent = (
  key: string,
  shiftKey: boolean,
  metaKey: boolean,
  ctrlKey: boolean,
) => {
  if (document.createEvent) {
    const event = document.createEvent('Events');
    event.initEvent('keydown', true, true);
    (event as Mutable<KeyboardEvent>).key = key;
    (event as Mutable<KeyboardEvent>).shiftKey = shiftKey;
    (event as Mutable<KeyboardEvent>).metaKey = metaKey;
    (event as Mutable<KeyboardEvent>).ctrlKey = ctrlKey;
    return event;
  }

  return new KeyboardEvent('keydown', { key });
};

describe('MediaEditor DefaultUndoerRedoer', () => {
  let undoerRedoer: UndoerRedoer;
  let undoSignalSpy: jest.Mock<any>;
  let redoSignalSpy: jest.Mock<any>;

  beforeEach(() => {
    undoerRedoer = new DefaultUndoerRedoer();

    undoSignalSpy = jest.fn();
    redoSignalSpy = jest.fn();

    undoerRedoer.undo.listen(undoSignalSpy);
    undoerRedoer.redo.listen(redoSignalSpy);
  });

  afterEach(() => {
    undoerRedoer.unload();
  });

  it("should not emit undo when it's not allowed", () => {
    document.dispatchEvent(createEvent('z', false, true, true));
    expect(undoSignalSpy).not.toHaveBeenCalled();
  });

  it("should emit undo when it's allowed", () => {
    undoerRedoer.undoEnabled();
    document.dispatchEvent(createEvent('z', false, true, true));
    expect(undoSignalSpy).toHaveBeenCalled();
  });

  it("should not emit redo when it's not allowed", () => {
    document.dispatchEvent(createEvent('z', true, true, true));
    expect(redoSignalSpy).not.toHaveBeenCalled();
  });

  it("should emit redo when it's allowed", () => {
    undoerRedoer.redoEnabled();
    document.dispatchEvent(createEvent('z', true, true, true));
    expect(redoSignalSpy).toHaveBeenCalled();
  });

  it('should emit undo on mac', () => {
    asMock(isMac).mockReturnValue(true);
    asMock(isWindows).mockReturnValue(false);
    undoerRedoer.undoEnabled();
    document.dispatchEvent(createEvent('z', false, true, false));
    expect(undoSignalSpy).toHaveBeenCalled();
  });

  it('should emit undo on windows', () => {
    asMock(isMac).mockReturnValue(false);
    asMock(isWindows).mockReturnValue(true);
    undoerRedoer.undoEnabled();
    document.dispatchEvent(createEvent('z', false, false, true));
    expect(undoSignalSpy).toHaveBeenCalled();
  });

  it('should emit undo on linux', () => {
    asMock(isMac).mockReturnValue(false);
    asMock(isWindows).mockReturnValue(false);
    undoerRedoer.undoEnabled();
    document.dispatchEvent(createEvent('z', false, false, true));
    expect(undoSignalSpy).toHaveBeenCalled();
  });

  it('should emit redo on mac', () => {
    asMock(isMac).mockReturnValue(true);
    asMock(isWindows).mockReturnValue(false);
    undoerRedoer.redoEnabled();
    document.dispatchEvent(createEvent('z', true, true, false));
    expect(redoSignalSpy).toHaveBeenCalled();
  });

  it('should emit redo on windows', () => {
    asMock(isWindows).mockReturnValue(true);
    asMock(isMac).mockReturnValue(false);
    undoerRedoer.redoEnabled();
    document.dispatchEvent(createEvent('y', false, false, true));
    expect(redoSignalSpy).toHaveBeenCalled();
  });

  it('should emit redo on linux', () => {
    asMock(isWindows).mockReturnValue(false);
    asMock(isMac).mockReturnValue(false);
    undoerRedoer.redoEnabled();
    document.dispatchEvent(createEvent('z', true, false, true));
    expect(redoSignalSpy).toHaveBeenCalled();
  });
});
