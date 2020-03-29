// eslint-disable-next-line import/prefer-default-export
export const dispatchMouseEvent = (
  eventName,
  options = {},
  target = window,
) => {
  const event = new window.MouseEvent(eventName, {
    bubbles: true,
    cancelable: true,
    view: window,
    ...options,
  });

  target.dispatchEvent(event);
  return event;
};
