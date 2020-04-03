export interface TouchEventProps {
  touches: Touch[];
}

export const createTouchEvent = (
  name: string,
  props: TouchEventProps = { touches: [] },
): TouchEvent => {
  const touches = props.touches;

  return new TouchEvent(name, {
    cancelable: true,
    bubbles: true,
    touches,
    targetTouches: [],
    changedTouches: touches,
    shiftKey: true,
  });
};
