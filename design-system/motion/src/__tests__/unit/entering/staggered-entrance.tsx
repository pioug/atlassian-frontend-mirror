/** @jsx jsx */
import { jsx } from '@emotion/core';
import { render } from '@testing-library/react';

import { useStaggeredEntrance } from '../../../entering/staggered-entrance';
import { StaggeredEntrance } from '../../../index';

describe('<StaggeredEntrance />', () => {
  const firstGroupDelay = '0ms';
  const secondGroupDelay = '52ms';
  const thirdGroupDelay = '83ms';
  const fourthGroupDelay = '104ms';
  const fifthGroupDelay = '121ms';

  interface BoundingBox {
    offsetHeight: number;
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
  }

  const EnteringComponent = ({
    id,
    box,
  }: {
    id: string;
    box?: Partial<BoundingBox>;
  }) => {
    const staggered = useStaggeredEntrance();
    if (typeof staggered.ref === 'function') {
      staggered.ref(box as HTMLElement);
    }

    return (
      <div
        ref={box ? null : staggered.ref}
        css={{
          animationDelay: `${staggered.delay}ms`,
        }}
        data-testid={id}
      />
    );
  };

  it('should set a staggered duration for a list of elements', () => {
    const { getByTestId } = render(
      <StaggeredEntrance columns={1}>
        <EnteringComponent id="first" />
        <EnteringComponent id="second" />
        <EnteringComponent id="third" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
  });

  it('should set a staggered duration for a grid of elements', () => {
    const { getByTestId } = render(
      <StaggeredEntrance columns={3}>
        <EnteringComponent id="top-left" />
        <EnteringComponent id="top-mid" />
        <EnteringComponent id="top-right" />
        <EnteringComponent id="mid-left" />
        <EnteringComponent id="mid-mid" />
        <EnteringComponent id="mid-right" />
        <EnteringComponent id="bottom-left" />
        <EnteringComponent id="bottom-mid" />
        <EnteringComponent id="bottom-right" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('top-left')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('top-mid')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('top-right')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
    expect(getByTestId('mid-left')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('mid-mid')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
    expect(getByTestId('mid-right')).toHaveStyleDeclaration(
      'animation-delay',
      fourthGroupDelay,
    );
    expect(getByTestId('bottom-left')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
    expect(getByTestId('bottom-mid')).toHaveStyleDeclaration(
      'animation-delay',
      fourthGroupDelay,
    );
    expect(getByTestId('bottom-right')).toHaveStyleDeclaration(
      'animation-delay',
      fifthGroupDelay,
    );
  });

  it('should set a staggered duration for the first column of a grid', () => {
    const { getByTestId } = render(
      <StaggeredEntrance column={0}>
        <EnteringComponent id="first" />
        <EnteringComponent id="second" />
        <EnteringComponent id="third" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
  });

  it('should set a staggered duration for the second column of a grid', () => {
    const { getByTestId } = render(
      <StaggeredEntrance column={1}>
        <EnteringComponent id="first" />
        <EnteringComponent id="second" />
        <EnteringComponent id="third" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      fourthGroupDelay,
    );
  });

  it('should set a staggered duration for the third column of a grid', () => {
    const { getByTestId } = render(
      <StaggeredEntrance column={2}>
        <EnteringComponent id="first" />
        <EnteringComponent id="second" />
        <EnteringComponent id="third" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      fourthGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      fifthGroupDelay,
    );
  });

  it('should render with no delay when there is only one child element', () => {
    const { getByTestId } = render(
      <StaggeredEntrance>
        <EnteringComponent box={{ offsetTop: 0 }} id="first" />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
  });

  it('should stagger over one column for a small viewport', () => {
    const { getByTestId } = render(
      <StaggeredEntrance>
        <EnteringComponent id="first" box={{ offsetTop: 0 }} />
        <EnteringComponent id="second" box={{ offsetTop: 50 }} />
        <EnteringComponent id="third" box={{ offsetTop: 100 }} />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
  });

  it('should stagger over two columns for a medium viewport', () => {
    const { getByTestId } = render(
      <StaggeredEntrance>
        <EnteringComponent id="first" box={{ offsetTop: 0 }} />
        <EnteringComponent id="second" box={{ offsetTop: 0 }} />
        <EnteringComponent id="third" box={{ offsetTop: 50 }} />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
  });

  it('should stagger over three columns for a large viewport', () => {
    const { getByTestId } = render(
      <StaggeredEntrance>
        <EnteringComponent id="first" box={{ offsetTop: 0 }} />
        <EnteringComponent id="second" box={{ offsetTop: 0 }} />
        <EnteringComponent id="third" box={{ offsetTop: 0 }} />
      </StaggeredEntrance>,
    );

    expect(getByTestId('first')).toHaveStyleDeclaration(
      'animation-delay',
      firstGroupDelay,
    );
    expect(getByTestId('second')).toHaveStyleDeclaration(
      'animation-delay',
      secondGroupDelay,
    );
    expect(getByTestId('third')).toHaveStyleDeclaration(
      'animation-delay',
      thirdGroupDelay,
    );
  });
});
