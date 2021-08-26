import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ButtonItem, PopupMenuGroup, Section } from '../src';

import Yeti from './icons/yeti.png';

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
      <div
        style={{
          display: 'inline-block',
          color: token('color.text.highEmphasis', N800),
          backgroundColor: token('color.background.overlay', '#fff'),
          boxShadow: token(
            'shadow.overlay',
            '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
          ),
          borderRadius: 4,
          margin: '16px auto',
          minWidth: '320px',
          maxWidth: '100%',
        }}
      >
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
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => setTextIndex(0)}>Again</Button>
      </div>
    </>
  );
};
