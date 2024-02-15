import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import { ButtonItem, PopupMenuGroup, Section } from '../../src';
import Yeti from '../icons/yeti.png';

const containerStyles = xcss({
  display: 'inline-block',
  color: 'color.text',
  backgroundColor: 'elevation.surface.overlay',
  boxShadow: 'elevation.shadow.overlay',
  borderRadius: 'border.radius',
  marginBlock: 'space.200',
  marginInline: 'auto',
  minWidth: '320px',
  maxWidth: '100%',
});

const buttonContainerStyles = xcss({
  display: 'flex',
  justifyContent: 'center',
});

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img alt={alt} src={src} height={24} width={24} style={{ borderRadius: 3 }} />
);

const fullText =
  'A spacecraft is a vehicle or machine designed to fly in outer space. A type of artificial satellite, spacecraft are used for a variety of purposes.';

export default () => {
  const [textIndex, setTextIndex] = useState(-1);

  useEffect(() => {
    // Slight delay to allow the page to load.
    const id = setTimeout(() => {
      setTextIndex(0);
    }, 500);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (textIndex === -1) {
      return;
    }

    if (textIndex !== fullText.length - 1) {
      const id = setTimeout(() => {
        setTextIndex((prev) => prev + 2);
      }, 30);

      return () => clearTimeout(id);
    }
  }, [textIndex]);

  return (
    <>
      <Box xcss={containerStyles}>
        <PopupMenuGroup>
          <Section>
            <ButtonItem
              iconBefore={<ImgIcon src={Yeti} alt={'Yeti'} />}
              description={fullText.slice(0, textIndex + 12)}
            >
              Spacecraft
            </ButtonItem>
          </Section>
        </PopupMenuGroup>
      </Box>

      <Box xcss={buttonContainerStyles}>
        <Button onClick={() => setTextIndex(0)}>Again</Button>
      </Box>
    </>
  );
};
