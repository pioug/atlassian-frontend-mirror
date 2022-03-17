import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { matchers } from '@emotion/jest';
import { mount } from 'enzyme';

// eslint-disable-next-line import/no-extraneous-dependencies
import { richMediaClassName } from '@atlaskit/editor-common/styles';

import MediaSingle, {
  Props as MediaSingleProps,
} from '../../../ui/MediaSingle';
import { MediaWrapper } from '../../../ui/MediaSingle/styled';

expect.extend(matchers);

describe('mediaSingle', () => {
  const defaultLineLength = 600;
  const defaultHeight = 200;

  const setup = (props: Partial<MediaSingleProps>) => {
    const wrapper = mount(
      <MediaSingle
        lineLength={defaultLineLength}
        layout="center"
        height={defaultHeight}
        {...props}
      >
        <div>mediachild</div>
      </MediaSingle>,
    );

    return {
      mediaWrapperProps: wrapper.find(MediaWrapper).props(),
      mediaSingleWrapper: wrapper.find(`div.${richMediaClassName}`),
    };
  };

  describe('when width is set', () => {
    describe('when there is no percent width', () => {
      it('should pass correct ratio and width', () => {
        const { mediaWrapperProps, mediaSingleWrapper } = setup({
          lineLength: 30,
          width: 40,
          height: 50,
        });

        const expectedRatio = (50 / 40) * 100;
        // To know what the value actually is
        expect(expectedRatio).toEqual(125);
        expect(mediaWrapperProps.paddingBottom).toEqual('125.000%');
        expect(mediaSingleWrapper).toHaveStyleRule('width', '40px');
      });

      it('should use percent width of 50 when aligned and width is bigger then half line length', () => {
        const { mediaWrapperProps, mediaSingleWrapper } = setup({
          lineLength: 600,
          width: 800,
          height: 200,
          layout: 'wrap-right',
        });

        const expectedWidth = (600 + 24) /* 624 */ * 0.5 /* 312 */ - 24;
        const expectedHeight = expectedWidth /* 288 */ * (200 / 800); /* 0.25 */
        const expectedRatio = (expectedHeight / expectedWidth) * 100;

        // To know what the value actually is
        expect(expectedWidth).toEqual(288);
        expect(expectedHeight).toEqual(72);
        expect(expectedRatio).toEqual(25);

        expect(mediaWrapperProps.paddingBottom).toEqual('25.000%');
        expect(mediaSingleWrapper).toHaveStyleRule(
          'width',
          `${expectedWidth}px`,
        );
      });
    });

    describe('when there percent width is given', () => {
      it('should pass correct ratio and width', () => {
        const { mediaWrapperProps, mediaSingleWrapper } = setup({
          lineLength: 596,
          width: 600,
          height: 200,
          pctWidth: 60,
        });

        const expectedWidth =
          (596 + 24) /* 620 */ * 0.6 /* 372 */ - 24; /* 116 */
        const expectedHeight =
          expectedWidth /* 348 */ * (200 / 600); /* 0.33333 */
        const expectedRatio = (expectedHeight / expectedWidth) * 100;

        // To know what the value actually is
        expect(expectedHeight).toEqual(116);
        expect(expectedWidth).toEqual(348);
        expect(expectedRatio).toEqual(33.33333333333333);

        expect(mediaWrapperProps.paddingBottom).toEqual('33.333%');
        expect(mediaSingleWrapper).toHaveStyleRule(
          'width',
          `${expectedWidth}px`,
        );
      });
    });

    describe('when containerWidth is not given', () => {
      it('should pass equate containerWidth to width argument', () => {
        const { mediaSingleWrapper } = setup({
          lineLength: 30,
          width: 40,
          height: 50,
        });
        expect(mediaSingleWrapper).toHaveStyleRule('width', '40px');
      });
    });

    describe('when node type is embedCard', () => {
      it('should pass paddingBottom with header excluded from given ratio', () => {
        const { mediaWrapperProps } = setup({
          lineLength: 30,
          width: 40,
          height: 50,
          nodeType: 'embedCard',
        });

        const expectedRatio = (50 / 40) * 100;
        // To know what the value actually is
        expect(expectedRatio).toEqual(125);
        expect(mediaWrapperProps.paddingBottom).toEqual(
          `calc(125.000% + 32px)`,
        );
      });
    });
  });

  describe('when width is not set', () => {
    describe('when percent width is given', () => {
      it('should pass correct height and width', () => {
        const { mediaWrapperProps, mediaSingleWrapper } = setup({
          lineLength: 600,
          width: undefined,
          height: 200,
          pctWidth: 50,
        });

        const expectedWidth =
          (600 + 24) /* 624 */ * 0.5 /* 312 */ - 24 /* 288 */ - 12; /* 276 */
        expect(expectedWidth).toEqual(276);

        expect(mediaWrapperProps.paddingBottom).toBeUndefined();
        expect(mediaWrapperProps.height).toEqual(200);
        expect(mediaSingleWrapper).toHaveStyleRule(
          'width',
          `${expectedWidth}px`,
        );
      });
    });

    describe('when percent width is not given', () => {
      it.each(['center', 'wide', 'full-width'])(
        'should pass correct height and width with %s layout',
        () => {
          const { mediaWrapperProps, mediaSingleWrapper } = setup({
            lineLength: 600,
            width: undefined,
            height: 200,
          });

          const expectedWidth = 680 /* DEFAULT_EMBED_CARD_WIDTH */ - 12;
          expect(expectedWidth).toEqual(668);

          expect(mediaWrapperProps.paddingBottom).toBeUndefined();
          expect(mediaWrapperProps.height).toEqual(200);
          expect(mediaSingleWrapper).toHaveStyleRule(
            'width',
            `${expectedWidth}px`,
          );
        },
      );
    });
  });

  it('should treat first child as media and wrap in MediaWrapper', () => {
    const media = <div>media</div>;
    const caption = <div>caption</div>;
    const wrapper = mount(
      <MediaSingle lineLength={30} layout="center" width={30} height={50}>
        {media}
        {caption}
      </MediaSingle>,
    );
    expect(wrapper.find(MediaWrapper).text()).toBe('media');
    expect(wrapper.text()).toBe('mediacaption');
  });
});
