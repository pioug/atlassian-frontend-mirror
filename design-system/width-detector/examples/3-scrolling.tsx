import React from 'react';
import styled from '@emotion/styled';
import { WidthObserver } from '../src';

const ResultBox = styled.div`
  position: relative;
  background-color: rebeccapurple;
  color: white;
`;

const Text = styled.p`
  width: 100%;
`;

const Aside = styled.aside`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  color: #fff;
  display: flex;
`;

const Lorem = () => (
  <Text>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Text>
);

export default function Example() {
  const [width, setWidth] = React.useState<number>(0);
  const [offscreen, setOffscreen] = React.useState(false);
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setOffscreen(e.target.checked),
    [setOffscreen],
  );

  return (
    <ResultBox data-frame>
      <WidthObserver setWidth={setWidth} offscreen={offscreen} />
      <Aside>
        <output name="width">{width}</output>
        <label style={{ marginLeft: 'auto' }}>
          offscreen
          <input
            name="offscreen"
            type="checkbox"
            checked={offscreen}
            onChange={onChange}
          />
        </label>
      </Aside>
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
      <Lorem />
    </ResultBox>
  );
}
