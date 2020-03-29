import React from 'react';
import { mount, render } from 'enzyme';

import { background } from '@atlaskit/theme/colors';
import { name } from '../../../version.json';
import Icon, { size, IconProps } from '../../..';
import { sizes as sizeValues } from '../../../constants';
import { IconWrapper } from '../../Icon';
import { sizeOpts } from '../../../types';

describe(name, () => {
  describe('Icon', () => {
    const secretContent = 'secret content';
    const secretWrapper = (props: {}) => <svg {...props}>{secretContent}</svg>;
    const empty = (props: {}) => <svg {...props}>Icon</svg>;
    const MyIcon = (props: IconProps) => (
      <Icon glyph={secretWrapper} {...props} />
    );

    it('should match the DOM Snapshot', () => {
      const wrapper = mount(<Icon glyph={empty} label="My icon" />);

      expect(wrapper).toMatchSnapshot();
    });

    describe('glyph prop', () => {
      it('should render an SVG provided via JSX', () => {
        const id = 'customSvg';
        const customGlyphJsx = (props: {}) => <svg {...props} id={id} />;

        const wrapper = mount(<Icon glyph={customGlyphJsx} label="" />);

        expect(wrapper.getDOMNode().querySelector(`#${id}`)).toBeDefined();
      });

      it('should present itself as an image', () => {
        const wrapper = mount(
          <Icon glyph={empty} testId="empty-icon" label="My icon" />,
        );

        expect(wrapper.find('span').props().role).toEqual('img');
      });
    });

    describe('dangerouslySetGlyph prop', () => {
      const id = 'customSvg';
      const customGlyphString = `<svg id=${id}></svg>`;

      it('should render an SVG provided as a string', () => {
        const wrapper = mount(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label="hello-world"
          />,
        );

        expect(wrapper.getDOMNode().querySelector(`#${id}`)).toBeDefined();
      });

      it('should present itself as an image when label is defined', () => {
        const wrapper = mount(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label="hello-world"
          />,
        );

        expect(
          wrapper.find('span[data-testid="test-icon"]').props()['role'],
        ).toEqual('img');
        expect(
          wrapper.find('span[data-testid="test-icon"]').props()['aria-label'],
        ).toEqual('hello-world');
      });

      it('should present itself as presentation when label is an empty string', () => {
        const wrapper = mount(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label=""
          />,
        );

        expect(
          wrapper.find('span[data-testid="test-icon"]').props()['role'],
        ).toEqual('presentation');
        expect(
          wrapper.find('span[data-testid="test-icon"]').props()['aria-label'],
        ).toEqual(undefined);
      });

      it('should replace idPlaceholders with a unique ID generated at runtime', () => {
        const gradientId = 'a-idPlaceholder';
        const glyphString = `<svg><defs><linearGradient id="${gradientId}"></linearGradient></defs><g><path fill="url(#${gradientId})"></path></g></svg>`;
        // Using render as mount/shallow as .find does not work with dangerouslySetInnerHTML
        const icon = render(
          <Icon dangerouslySetGlyph={glyphString} label="My icon" />,
        );
        const uuidLength = 7;

        // for some reason cheerio will no longer find linear gradient elements. Instead we look
        // inside defs and confirm that we have a linearGradient
        const gradientEls = icon.find('defs > *');
        expect(gradientEls.length).toBe(1);
        expect(gradientEls[0].name).toBe('linearGradient');

        // now we can check the id of it
        const gradientDomId = gradientEls[0].attribs.id;
        expect(typeof gradientDomId).toBe('string');
        expect(gradientDomId).not.toBe(gradientId);
        expect(gradientDomId.length).toBeGreaterThan(uuidLength);

        const otherIcon = render(
          <Icon dangerouslySetGlyph={glyphString} label="My icon" />,
        );
        const otherId = otherIcon.find('lineargradient').prop('id');
        expect(otherId).not.toBe(gradientDomId);
      });
    });

    describe('exports', () => {
      it('exports handled sizes', () => {
        expect(size).not.toBe(undefined);
        expect(Object.keys(size).map(index => size[index])).toEqual([
          'small',
          'medium',
          'large',
          'xlarge',
        ]);
      });
    });

    it('should be possible to create an Icon via a subclass', () => {
      const wrapper = mount(<MyIcon label="My icon" />);

      expect(wrapper.find('span').is('[aria-label="My icon"]')).toBe(true);
    });

    describe('label property', () => {
      it('is accessed by glyph', () => {
        const LabelWriter = (props: { label?: string; role: string }) => (
          <svg {...props}>{props.label}</svg>
        );
        const labelContent = 'label content';
        const wrapper = mount(
          <Icon glyph={LabelWriter} label={labelContent} />,
        );
        expect(wrapper.find('span').is(`[aria-label="${labelContent}"]`)).toBe(
          true,
        );
      });
    });

    describe('size property', () => {
      const sizes: sizeOpts[] = ['small', 'medium', 'large', 'xlarge'];

      sizes.forEach(s => {
        const wrapper = mount(<Icon glyph={empty} label="My icon" size={s} />);
        const iconWrapper = wrapper.find(IconWrapper);

        it(`with value ${s}`, () => {
          expect(iconWrapper).toHaveStyleRule('height', sizeValues[s]);
          expect(iconWrapper).toHaveStyleRule('width', sizeValues[s]);
        });
      });
    });

    describe('primaryColor property', () => {
      it('is set to inherit the text color by default', () => {
        const wrapper = mount(<MyIcon label="default primaryColor" />);
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule('color', 'currentColor');
      });

      it('can be changed to a hex value', () => {
        const primaryColor = '#ff0000';
        const wrapper = mount(
          <MyIcon label="hex primaryColor" primaryColor={primaryColor} />,
        );
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule('color', primaryColor);
      });

      it('can be changed to a named color', () => {
        const primaryColor = 'rebeccapurple';
        const wrapper = mount(
          <MyIcon label="hex primaryColor" primaryColor={primaryColor} />,
        );
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule('color', primaryColor);
      });
    });

    describe('secondaryColor property', () => {
      it('is set to the default theme background color by default', () => {
        const wrapper = mount(<MyIcon label="default secondaryColor" />);
        const props = wrapper.props();
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule(
          'fill',
          background(props).toString(),
        );
      });

      it('can be changed to a hex value', () => {
        const secondaryColor = '#ff0000';
        const wrapper = mount(
          <MyIcon label="hex secondaryColor" secondaryColor={secondaryColor} />,
        );
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule('fill', secondaryColor);
      });

      it('can be changed to a named color', () => {
        const secondaryColor = 'rebeccapurple';
        const wrapper = mount(
          <MyIcon label="hex secondaryColor" secondaryColor={secondaryColor} />,
        );
        const iconWrapper = wrapper.find(IconWrapper);

        expect(iconWrapper).toHaveStyleRule('fill', secondaryColor);
      });
    });

    describe('Svg', () => {
      it('should not be able to click on the svg', () => {
        const handler = jest.fn().mockImplementation(() => {});
        const id = 'customSvg';
        const customGlyphJsx = () => <svg id={id} />;
        const wrapper = mount(<Icon glyph={customGlyphJsx} label="My icon" />);
        wrapper.find('svg').simulate('click');
        expect(handler.mock.calls.length).toBe(0);
      });
    });
  });
});
