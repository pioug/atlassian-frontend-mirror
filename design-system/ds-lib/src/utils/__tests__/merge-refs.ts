import { createRef } from 'react';

import mergeRefs from '../merge-refs';

describe('#mergeRefs', () => {
  const node = document.createElement('div');

  it('should invoke the ref with the node passed if ref is a function', () => {
    const ref = jest.fn() as (node: HTMLElement | null) => void;

    mergeRefs([ref])(node);

    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenCalledWith(node);
  });

  it('should set the current value with the node passed if ref is not null', () => {
    const ref = createRef<HTMLElement | null>();
    mergeRefs([ref])(node);

    expect(ref.current).toEqual(node);
  });

  it('should do nothing if ref is null', () => {
    const ref = null;
    mergeRefs([ref])(node);

    expect(ref).toEqual(null);
  });

  it('should pass the node to all refs if there are multiple', () => {
    const refFn = jest.fn() as (node: HTMLElement | null) => void;
    const refObject = createRef<HTMLElement | null>();

    mergeRefs([refFn, refObject])(node);

    expect(refFn).toHaveBeenCalledTimes(1);
    expect(refFn).toHaveBeenCalledWith(node);

    expect(refObject.current).toEqual(node);
  });
});
