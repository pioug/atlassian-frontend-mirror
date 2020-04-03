import { findParentByClassname } from '../..';

describe('findParentByClassname()', () => {
  it('should return the parent element if the class matches', () => {
    const wrapper = document.createElement('div');
    const child = document.createElement('div');
    wrapper.classList.add('a', 'some-class');
    wrapper.appendChild(child);

    expect(findParentByClassname(child, 'some-class')).toEqual(wrapper);
  });

  it('should return the element itself if it returns the classname', () => {
    const child = document.createElement('div');
    child.classList.add('some-class');

    expect(findParentByClassname(child, 'some-class')).toEqual(child);
  });

  it('should return undefined if there is no parent element matching', () => {
    const wrapper = document.createElement('div');
    const child = document.createElement('div');
    wrapper.classList.add('a');
    wrapper.appendChild(child);

    expect(findParentByClassname(child, 'some-class')).toBeUndefined();
  });

  it('should respect passed max parent element as boundary', () => {
    const superWrapper = document.createElement('div');
    const wrapper = document.createElement('div');
    const child = document.createElement('div');
    wrapper.classList.add('some-class');
    superWrapper.appendChild(wrapper);
    wrapper.appendChild(child);

    expect(findParentByClassname(child, 'some-class', wrapper)).toBeUndefined();
  });
});
