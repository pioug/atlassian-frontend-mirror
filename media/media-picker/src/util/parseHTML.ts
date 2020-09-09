export const parseHTML = function (htmlString: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;
  return wrapper.childNodes[0] as HTMLElement;
};
