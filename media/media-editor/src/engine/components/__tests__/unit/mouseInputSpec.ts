import { createMouseEvent } from '@atlaskit/media-test-helpers';
import { DefaultMouseInput } from '../../mouseInput';

describe('MediaEditor DefaultMouseInput', () => {
  let element: HTMLDivElement;
  let mouseInput: DefaultMouseInput;

  const width = 510;
  const height = 436;

  const positionCalculator = (event: MouseEvent) => {
    // custom position calculator for tests
    return { x: event.clientX / width, y: event.clientY / height };
  };

  const xStart = 100;
  const yStart = 150;
  const start = { x: xStart / width, y: yStart / height };

  const xMiddle = 435;
  const yMiddle = 292;
  const middle = { x: xMiddle / width, y: yMiddle / height };

  const xEnd = 218;
  const yEnd = 441;
  const end = { x: xEnd / width, y: yEnd / height };

  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
    element = document.createElement('div');
    mouseInput = new DefaultMouseInput(element, positionCalculator);
  });

  afterEach(() => {
    //@ts-ignore no mockRestore on warn
    global.console.warn.mockRestore();
    //@ts-ignore no mockRestore on error
    global.console.error.mockRestore();
    mouseInput.unload();
  });

  it('should report nothing if only window is clicked', () => {
    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(() => {
      throw new Error('drag start method should not be called');
    });
    mouseInput.dragMove.listen(() => {
      throw new Error('drag move method should not be called');
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    window.dispatchEvent(createMouseEvent('mousedown'));
    window.dispatchEvent(createMouseEvent('mouseup'));
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should report nothing if right button is clicked', () => {
    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(() => {
      throw new Error('drag start method should not be called');
    });
    mouseInput.dragMove.listen(() => {
      throw new Error('drag move method should not be called');
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(createMouseEvent('mousedown', { mouseButton: 2 }));
    window.dispatchEvent(createMouseEvent('mouseup', { mouseButton: 2 }));
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should report nothing if right button is dragged', () => {
    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(() => {
      throw new Error('drag start method should not be called');
    });
    mouseInput.dragMove.listen(() => {
      throw new Error('drag move method should not be called');
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(createMouseEvent('mousedown', { mouseButton: 2 }));
    element.dispatchEvent(createMouseEvent('mousemove', { mouseButton: 2 }));
    window.dispatchEvent(createMouseEvent('mouseup', { mouseButton: 2 }));
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should report one click if left button is down and up', () => {
    mouseInput.click.listen(pos => {
      expect(pos).toEqual(start);
    });
    mouseInput.dragStart.listen(() => {
      throw new Error('drag start method should not be called');
    });
    mouseInput.dragMove.listen(() => {
      throw new Error('drag move method should not be called');
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(
      createMouseEvent('mousedown', {
        mouseButton: 0,
        clientX: xStart,
        clientY: yStart,
      }),
    );
    window.dispatchEvent(createMouseEvent('mouseup'));
  });

  it('should report mouse move when the mouse is dragged', () => {
    let moveCounter = 0;

    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(pos => {
      expect(pos).toEqual(start);
    });
    mouseInput.dragMove.listen(pos => {
      expect(pos).toEqual(middle);
      ++moveCounter;
    });
    mouseInput.dragEnd.listen(pos => {
      expect(pos).toEqual(end);
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(
      createMouseEvent('mousedown', { clientX: xStart, clientY: yStart }),
    );
    window.dispatchEvent(
      createMouseEvent('mousemove', { clientX: xMiddle, clientY: yMiddle }),
    );
    window.dispatchEvent(
      createMouseEvent('mousedown', {
        mouseButton: 2,
        clientX: xMiddle,
        clientY: yMiddle,
      }),
    );
    window.dispatchEvent(
      createMouseEvent('mousemove', {
        mouseButton: 2,
        clientX: xMiddle,
        clientY: yMiddle,
      }),
    );
    window.dispatchEvent(
      createMouseEvent('mousemove', {
        mouseButton: 2,
        clientX: xMiddle,
        clientY: yMiddle,
      }),
    );
    window.dispatchEvent(
      createMouseEvent('mouseup', {
        mouseButton: 2,
        clientX: xMiddle,
        clientY: yMiddle,
      }),
    );
    window.dispatchEvent(
      createMouseEvent('mouseup', { clientX: xEnd, clientY: yEnd }),
    );

    expect(moveCounter).toBe(3);
  });

  it('should report nothing if the window is blurred immediately after mouse down', () => {
    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(() => {
      throw new Error('drag start method should not be called');
    });
    mouseInput.dragMove.listen(() => {
      throw new Error('drag move method should not be called');
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(
      createMouseEvent('mousedown', {
        mouseButton: 0,
        clientX: xStart,
        clientY: yStart,
      }),
    );
    window.dispatchEvent(createEvent('blur'));
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should report drag lost if the window is blurred during mouse dragging', () => {
    let dragLostCalled = false;

    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(pos => {
      expect(pos).toEqual(start);
    });
    mouseInput.dragMove.listen(pos => {
      expect(pos).toEqual(middle);
    });
    mouseInput.dragEnd.listen(() => {
      throw new Error('drag end method should not be called');
    });
    mouseInput.dragLost.listen(() => {
      dragLostCalled = true;
    });

    element.dispatchEvent(
      createMouseEvent('mousedown', { clientX: xStart, clientY: yStart }),
    );
    window.dispatchEvent(
      createMouseEvent('mousemove', { clientX: xMiddle, clientY: yMiddle }),
    );
    window.dispatchEvent(createEvent('blur'));
    window.dispatchEvent(
      createMouseEvent('mouseup', { clientX: xEnd, clientY: yEnd }),
    );

    expect(dragLostCalled).toBe(true);
  });

  it('should not report drag lost if the window is blurred after dragging complete', () => {
    mouseInput.click.listen(() => {
      throw new Error('click method should not be called');
    });
    mouseInput.dragStart.listen(pos => {
      expect(pos).toEqual(start);
    });
    mouseInput.dragMove.listen(pos => {
      expect(pos).toEqual(middle);
    });
    mouseInput.dragEnd.listen(pos => {
      expect(pos).toEqual(end);
    });
    mouseInput.dragLost.listen(() => {
      throw new Error('drag lost method should not be called');
    });

    element.dispatchEvent(
      createMouseEvent('mousedown', { clientX: xStart, clientY: yStart }),
    );
    window.dispatchEvent(
      createMouseEvent('mousemove', { clientX: xMiddle, clientY: yMiddle }),
    );
    window.dispatchEvent(
      createMouseEvent('mouseup', { clientX: xEnd, clientY: yEnd }),
    );
    window.dispatchEvent(createEvent('blur'));
  });

  const createEvent = (name: string): Event => {
    if (document.createEvent) {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      return event;
    } else {
      return new Event(name);
    }
  };
});
