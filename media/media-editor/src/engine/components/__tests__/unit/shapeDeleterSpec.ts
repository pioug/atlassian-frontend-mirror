import { DefaultShapeDeleter } from '../../shapeDeleter';

describe('MediaEditor DefaultShapeDeleter', () => {
  let textArea: HTMLTextAreaElement;
  let shapeDeleter: DefaultShapeDeleter;
  let signalSpy: jest.Mock<any>;

  beforeEach(() => {
    textArea = document.createElement('textarea');
    shapeDeleter = new DefaultShapeDeleter(textArea);

    signalSpy = jest.fn();
    shapeDeleter.deleteShape.listen(signalSpy);
  });

  afterEach(() => {
    shapeDeleter.unload();
  });

  it('should not emit deleteShape if deletion is not allowed', () => {
    textArea.dispatchEvent(createEventWithKey('Delete'));

    expect(signalSpy).not.toHaveBeenCalled();
  });

  it('should emit deleteShape when Delete key is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithKey('Delete'));

    expect(signalSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit deleteShape when Backspace key is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithKey('Backspace'));

    expect(signalSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit deleteShape when key #46 (delete) is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithWhich(46));

    expect(signalSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit deleteShape when key #8 (backspace) is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithWhich(8));

    expect(signalSpy).toHaveBeenCalledTimes(1);
  });

  it('should not emit deleteShape when PageDown key is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithKey('PageDown'));

    expect(signalSpy).not.toHaveBeenCalled();
  });

  it('should not emit deleteShape when key #37 (arrow left) is passed and deletion is allowed', () => {
    shapeDeleter.deleteEnabled();
    textArea.dispatchEvent(createEventWithWhich(37));

    expect(signalSpy).not.toHaveBeenCalled();
  });

  it('should not emit deleteShape if deletion was already disabled', () => {
    shapeDeleter.deleteEnabled();
    shapeDeleter.deleteDisabled();
    textArea.dispatchEvent(createEventWithKey('Delete'));

    expect(signalSpy).not.toHaveBeenCalled();
  });

  const createEventWithKey = (key: string) => {
    if (document.createEvent) {
      const event = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      (event as any).key = key;
      return event;
    }

    return new KeyboardEvent('keydown', { key });
  };

  const createEventWithWhich = (which: number) => {
    if (document.createEvent) {
      const event = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      (event as any).which = which;
      return event;
    }

    const initializer: KeyboardEventInit = {};
    (initializer as any).which = which;
    return new KeyboardEvent('keydown', initializer);
  };
});
