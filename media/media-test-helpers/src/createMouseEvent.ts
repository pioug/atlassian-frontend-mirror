export interface MouseEventProps {
  mouseButton?: number;
  clientX?: number;
  clientY?: number;
  screenX?: number;
  screenY?: number;
}

export const createMouseEvent = (
  name: string,
  props: MouseEventProps = {},
): MouseEvent => {
  const {
    mouseButton: mb,
    clientX: cx,
    clientY: cy,
    screenX: sx,
    screenY: sy,
  } = props;

  if (document.createEvent) {
    const event = document.createEvent('MouseEvent');
    event.initMouseEvent(
      name,
      true,
      true,
      window,
      0,
      sx || 0,
      sy || 0,
      cx || 0,
      cy || 0,
      false,
      false,
      false,
      false,
      mb || 0,
      null,
    );
    return event;
  }

  return new MouseEvent(name, {
    button: mb,
    clientX: cx || 0,
    clientY: cy || 0,
  });
};
