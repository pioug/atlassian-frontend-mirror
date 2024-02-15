import React from 'react';

import { render } from '@testing-library/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
} from '../../../index';
import { pulseKeyframesName } from '../../../styled/target';

interface ElementStubProps {
  testId?: string;
  children: React.ReactNode;
  height: number;
  width: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  position?: 'fixed';
}

const ElementStub = (props: ElementStubProps) => {
  return (
    <div
      data-testid={props.testId}
      style={{ position: props.position }}
      ref={(ref) => {
        if (!ref) {
          return;
        }

        // We calculate the bounding client rect from the props passed in.
        ref.getBoundingClientRect = (): DOMRect => ({
          width: props.width,
          height: props.height,
          left: props.marginLeft || 0,
          top: props.marginTop || 0,
          bottom: window.innerHeight - props.height - (props.marginBottom || 0),
          right: window.innerWidth - props.width - (props.marginRight || 0),
          x: 0,
          y: 0,
          toJSON() {
            return JSON.stringify(this);
          },
        });
      }}
    >
      {props.children}
    </div>
  );
};

const buildOnboardingMarkup = (target: string) => (
  <SpotlightManager>
    <SpotlightTarget name="target-one">
      <ElementStub
        width={100}
        height={50}
        testId="target"
        marginLeft={50}
        marginTop={100}
      >
        target one
      </ElementStub>
    </SpotlightTarget>

    <SpotlightTarget name="target-two">
      <ElementStub
        width={100}
        height={50}
        testId="target1"
        marginLeft={100}
        marginTop={100}
      >
        target two
      </ElementStub>
    </SpotlightTarget>

    <SpotlightTarget name="target-three">
      <ElementStub
        width={100}
        height={50}
        testId="target2"
        marginLeft={150}
        marginTop={100}
      >
        target three
      </ElementStub>
    </SpotlightTarget>

    <Spotlight key={target} target={target}>
      Spotlight for {target}
    </Spotlight>
  </SpotlightManager>
);

describe('<Spotlight />', () => {
  it('should position the cloned target ontop of the original', () => {
    const { getByTestId } = render(buildOnboardingMarkup('target-one'));

    expect(getByTestId('spotlight--target')).toHaveStyle({ position: 'fixed' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ height: '50px' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ width: '100px' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ left: '50px' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ top: '100px' });
  });

  it('should render the spotlight dialog', () => {
    const { getByTestId } = render(buildOnboardingMarkup('target-one'));

    expect(getByTestId('spotlight--dialog').innerText).toEqual(
      'Spotlight for target-one',
    );
  });

  it('should re-render and show the second spotlight', () => {
    const { rerender, getByTestId } = render(
      buildOnboardingMarkup('target-one'),
    );

    rerender(buildOnboardingMarkup('target-two'));

    expect(getByTestId('spotlight--target')).toHaveStyle({ left: '100px' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ top: '100px' });
    expect(getByTestId('spotlight--dialog').innerText).toEqual(
      'Spotlight for target-two',
    );
  });

  it('should re-render and show the third spotlight', () => {
    const { rerender, getByTestId } = render(
      buildOnboardingMarkup('target-one'),
    );

    rerender(buildOnboardingMarkup('target-two'));
    rerender(buildOnboardingMarkup('target-three'));

    expect(getByTestId('spotlight--target')).toHaveStyle({ left: '150px' });
    expect(getByTestId('spotlight--target')).toHaveStyle({ top: '100px' });
    expect(getByTestId('spotlight--dialog').innerText).toEqual(
      'Spotlight for target-three',
    );
  });

  it('should render a spotlight target without a parent manager without blowing up', () => {
    expect(() => {
      render(
        <SpotlightTarget name="target-one">
          <ElementStub
            width={100}
            height={50}
            testId="target"
            marginLeft={50}
            marginTop={100}
          >
            target one
          </ElementStub>
        </SpotlightTarget>,
      );
    }).not.toThrow();
  });

  it('should retain a fixed positioned target as fixed when under a spotlight', () => {
    const { getByTestId } = render(
      <SpotlightManager>
        <SpotlightTarget name="target-one">
          <ElementStub
            width={100}
            height={50}
            position="fixed"
            testId="target"
            marginLeft={50}
            marginTop={100}
          >
            target one
          </ElementStub>
        </SpotlightTarget>

        <Spotlight target="target-one">Spotlight for target-one</Spotlight>
      </SpotlightManager>,
    );

    expect(getByTestId('spotlight--target')).toHaveStyle({ position: 'fixed' });
  });

  it('should not log any errors when rendering the spotlight', () => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      throw new Error(msg);
    });

    expect(() => {
      render(
        <SpotlightManager>
          <SpotlightTarget name="target-one">
            <ElementStub
              width={100}
              height={50}
              position="fixed"
              testId="target"
              marginLeft={50}
              marginTop={100}
            >
              target one
            </ElementStub>
          </SpotlightTarget>

          <Spotlight
            actions={[{ text: 'Primary' }, { text: 'Secondary' }]}
            target="target-one"
          >
            Spotlight for target-one
          </Spotlight>
        </SpotlightManager>,
      );
    }).not.toThrow();
  });

  it('pulse should not appear on target element when SpotlightPulse pulse prop is true', () => {
    const { getByTestId } = render(
      <SpotlightManager>
        <SpotlightTarget name="target-one">
          <ElementStub
            width={100}
            height={50}
            position="fixed"
            testId="target"
            marginLeft={50}
            marginTop={100}
          >
            Target
          </ElementStub>
        </SpotlightTarget>

        <Spotlight target="target-one">Spotlight for target</Spotlight>
      </SpotlightManager>,
    );

    expect(getByTestId('spotlight--target')).toHaveStyle(
      `animation: ${pulseKeyframesName} 3000ms cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite`,
    );
  });

  it('pulse should not appear on target element when SpotlightPulse pulse prop is false', () => {
    const { getByTestId } = render(
      <SpotlightManager>
        <SpotlightTarget name="target-one">
          <ElementStub
            width={100}
            height={50}
            position="fixed"
            testId="target"
            marginLeft={50}
            marginTop={100}
          >
            Target
          </ElementStub>
        </SpotlightTarget>

        <Spotlight pulse={false} target="target-one">
          Spotlight for target
        </Spotlight>
      </SpotlightManager>,
    );

    expect(getByTestId('spotlight--target')).not.toHaveStyle(
      `animation: ${pulseKeyframesName} 3000ms cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite`,
    );
  });

  it('pulse should not appear on element when SpotlightPulse pulse prop is false', () => {
    const { getByTestId } = render(
      <SpotlightManager>
        <ButtonGroup label="Choose spotlight options">
          <SpotlightTarget name="copy">
            <SpotlightPulse pulse={false} radius={3} testId="spotlight-pulse">
              <Button>Existing feature</Button>
            </SpotlightPulse>
          </SpotlightTarget>
        </ButtonGroup>
      </SpotlightManager>,
    );

    expect(getByTestId('spotlight-pulse')).not.toHaveStyle(
      `animation: ${pulseKeyframesName} 3000ms cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite`,
    );
  });

  it('pulse should appear on element when SpotlightPulse pulse prop is true', () => {
    const { getByTestId } = render(
      <SpotlightManager>
        <ButtonGroup label="Choose spotlight options">
          <SpotlightTarget name="copy">
            <SpotlightPulse pulse={true} radius={3} testId="spotlight-pulse">
              <Button>Existing feature</Button>
            </SpotlightPulse>
          </SpotlightTarget>
        </ButtonGroup>
      </SpotlightManager>,
    );

    expect(getByTestId('spotlight-pulse')).toHaveStyle(
      `animation: ${pulseKeyframesName} 3000ms cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite`,
    );
  });
});
