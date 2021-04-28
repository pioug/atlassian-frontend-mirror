import React from 'react';

import { render } from '@testing-library/react';

import useScrollbarWidth from '../use-scrollbar-width';

describe('useScrollbarWidth()', () => {
  const Container = ({
    refStub,
    onRender,
  }: {
    refStub?: any;
    onRender?: () => void;
  }) => {
    const { width, ref } = useScrollbarWidth();
    ref.current = refStub;
    onRender && onRender();
    return <div data-width={width}>hello world</div>;
  };

  it('should not cause an infinite loop when re-rendering', () => {
    const onRender = jest.fn();
    const { rerender } = render(<Container onRender={onRender} />);

    rerender(<Container onRender={onRender} />);

    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('should return zero when there is no scrollbar', () => {
    const { getByText } = render(<Container />);

    expect(getByText('hello world').getAttribute('data-width')).toEqual('0');
  });

  it('should return the difference of offset and scroll width', () => {
    const { getByText } = render(
      <Container refStub={{ offsetWidth: 100, scrollWidth: 80 }} />,
    );

    expect(getByText('hello world').getAttribute('data-width')).toEqual('20');
  });

  it('should return the difference of offset and scroll width', () => {
    const { getByText } = render(
      <Container refStub={{ offsetWidth: 100, scrollWidth: 80 }} />,
    );

    expect(getByText('hello world').getAttribute('data-width')).toEqual('20');
  });

  it('should rerender twice when setting width', () => {
    // Twice for initial.
    const onRender = jest.fn();
    render(
      <Container
        onRender={onRender}
        refStub={{ offsetWidth: 100, scrollWidth: 80 }}
      />,
    );

    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('should only rerender three when width has not changed', () => {
    // Twice initial, third for the rerender.
    const onRender = jest.fn();
    const { rerender } = render(
      <Container
        onRender={onRender}
        refStub={{ offsetWidth: 100, scrollWidth: 80 }}
      />,
    );

    rerender(
      <Container
        onRender={onRender}
        refStub={{ offsetWidth: 100, scrollWidth: 80 }}
      />,
    );

    expect(onRender).toHaveBeenCalledTimes(3);
  });
});
