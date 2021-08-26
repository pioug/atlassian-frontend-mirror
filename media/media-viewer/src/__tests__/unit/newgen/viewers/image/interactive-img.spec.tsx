import React from 'react';
import { ReactWrapper } from 'enzyme';
import * as jsverify from 'jsverify';
import Button from '@atlaskit/button/custom-theme-button';
import {
  createMouseEvent,
  mountWithIntlContext,
} from '@atlaskit/media-test-helpers';
import { Rectangle, Camera, Vector2 } from '@atlaskit/media-ui';
import { MAX_RESOLUTION } from '@atlaskit/media-client';
import {
  InteractiveImgComponent,
  zoomLevelAfterResize,
  Props,
  State,
} from '../../../../../viewers/image/interactive-img';
import { ZoomControls } from '../../../../../zoomControls';
import { HDIconGroupWrapper, ImageWrapper, Img } from '../../../../../styled';
import { ZoomLevel } from '../../../../../domain/zoomLevel';

interface ImageSize {
  naturalWidth: number;
  naturalHeight: number;
}

function callOnLoad(
  component: ReactWrapper<Props, State>,
  props?: Partial<Props & ImageSize>,
) {
  const currentTarget: Partial<HTMLImageElement> = {
    naturalWidth: (props && props.naturalWidth) || MAX_RESOLUTION,
    naturalHeight: (props && props.naturalHeight) || MAX_RESOLUTION * 0.75,
  };
  const onLoad = component.find(Img).props().onLoad;
  if (!onLoad) {
    throw expect(onLoad).toBeDefined();
  } else {
    const event: Partial<React.SyntheticEvent<HTMLImageElement>> = {
      currentTarget: currentTarget as any,
    };
    onLoad(event as any);
  }

  component.update();
}

function setup(props?: Partial<Props & ImageSize>) {
  const onClose = jest.fn();
  const onBlanketClicked = jest.fn();
  const component = mountWithIntlContext<Props, State, InteractiveImgComponent>(
    <InteractiveImgComponent
      onLoad={jest.fn()}
      onError={jest.fn()}
      src={'some-src'}
      onClose={onClose}
      onBlanketClicked={onBlanketClicked}
      {...props}
    />,
  );

  const wrapper = component.find(ImageWrapper).getDOMNode();
  Object.defineProperty(wrapper, 'clientWidth', {
    value: 400,
  });
  Object.defineProperty(wrapper, 'clientHeight', {
    value: 300,
  });

  callOnLoad(component, props);

  const { camera, zoomLevel } = component.state();
  if (!camera) {
    throw expect(camera).toBeDefined();
  }
  return { component, onClose, camera, zoomLevel, onBlanketClicked };
}

function clickZoomIn(component: ReactWrapper<any, any>) {
  component.find(ZoomControls).find(Button).last().simulate('click');
}

function clickZoomOut(component: ReactWrapper<any, any>) {
  component.find(ZoomControls).find(Button).first().simulate('click');
}

describe('InteractiveImg', () => {
  it('should allow zooming', async () => {
    const { component } = setup({
      naturalWidth: 400,
      naturalHeight: 300,
    });
    expect(component.find(ZoomControls)).toHaveLength(1);
    expect(component.state().zoomLevel.value).toEqual(1);

    clickZoomOut(component);
    expect(component.state().zoomLevel.value).toBeLessThan(1);

    clickZoomIn(component);
    expect(component.state().zoomLevel.value).toEqual(1);
  });

  it('should set the correct width and height on the Img element', () => {
    const { component, camera, zoomLevel } = setup();
    const styleProp = component.find(Img).prop('style');
    expect(styleProp).toMatchObject(camera.scaledImg(zoomLevel.value));
  });

  it('should set the correct scrollLeft and scrollTop values on the ImageWrapper', () => {
    const { component, camera, zoomLevel } = setup();
    const imgWrapper = component.find(ImageWrapper).getDOMNode();

    const prevOffset = new Vector2(imgWrapper.scrollLeft, imgWrapper.scrollTop);
    const prevScale = zoomLevel.value;
    const nextScale = zoomLevel.zoomIn().value;

    clickZoomIn(component);

    const expectedOffset = camera.scaledOffset(
      prevOffset,
      prevScale,
      nextScale,
    );
    expect(imgWrapper.scrollLeft).toEqual(expectedOffset.x);
    expect(imgWrapper.scrollTop).toEqual(expectedOffset.y);
  });

  it('should resize a fitted image when the window is resized', () => {
    const { component, camera } = setup();
    const oldZoomLevel = new ZoomLevel(camera.scaleDownToFit);
    component.setState({ zoomLevel: oldZoomLevel });

    const newViewport = new Rectangle(100, 100);
    const newCamera = camera.resizedViewport(newViewport);
    const newWrapper = {
      clientWidth: newViewport.width,
      clientHeight: newViewport.height,
    };

    (component.instance() as any)['wrapper'] = newWrapper;
    window.dispatchEvent(new CustomEvent('resize'));

    const expectedZoomLevel = zoomLevelAfterResize(
      newCamera,
      camera,
      oldZoomLevel,
    );

    const {
      zoomLevel: actualZoomLevel,
      camera: actualCamera,
    } = component.state();
    expect(actualCamera).not.toBeUndefined();
    expect(actualCamera!.viewport).toEqual(newViewport);
    expect(actualZoomLevel.value).toEqual(expectedZoomLevel.value);
  });

  it('should rotate image when orientation is provided', () => {
    const { component } = setup({ orientation: 2 });

    expect(component.find(Img).prop('style')).toEqual(
      expect.objectContaining({
        transform: 'rotateY(180deg)',
      }),
    );
  });

  describe('drag and drop', () => {
    it('should not move image before a mousedown event', () => {
      const { component } = setup();
      const wrapper = component.find(ImageWrapper).getDOMNode();
      const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;
      const mouseMove = createMouseEvent('mousemove', {
        screenX: 300,
        screenY: 200,
      });
      document.dispatchEvent(mouseMove);
      expect(wrapper.scrollLeft).toEqual(oldScrollLeft);
      expect(wrapper.scrollTop).toEqual(oldScrollTop);
    });

    it('should move image after a mousedown event', () => {
      const { component } = setup();

      component.find(Img).simulate('mousedown', { screenX: 100, screenY: 100 });

      const wrapper = component.find(ImageWrapper).getDOMNode();
      const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;

      const mouseMove = createMouseEvent('mousemove', {
        screenX: 300,
        screenY: 200,
      });
      document.dispatchEvent(mouseMove);

      expect(wrapper.scrollLeft).not.toEqual(oldScrollLeft);
      expect(wrapper.scrollTop).not.toEqual(oldScrollTop);
    });

    it('should stop moving image after a mouseup event', () => {
      const { component } = setup();

      component.find(Img).simulate('mousedown', { screenX: 100, screenY: 100 });
      const mouseUp = createMouseEvent('mouseup');
      document.dispatchEvent(mouseUp);

      const wrapper = component.find(ImageWrapper).getDOMNode();
      const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;

      const mouseMove = createMouseEvent('mousemove', {
        screenX: 300,
        screenY: 200,
      });
      document.dispatchEvent(mouseMove);

      expect(wrapper.scrollLeft).toEqual(oldScrollLeft);
      expect(wrapper.scrollTop).toEqual(oldScrollTop);
    });

    it('should make an image draggable when it is zoomed larger than the screen', () => {
      const { component, camera } = setup();
      const zoomLevel = new ZoomLevel(camera.scaleToFit * 1.5);
      component.setState({ zoomLevel });
      expect(component.find(Img).prop('canDrag')).toEqual(true);
    });

    it('should make an image not draggable when it is zoomed smaller than or equal to the screen', () => {
      const { component, camera } = setup();
      const zoomLevel = new ZoomLevel(camera.scaleToFit);
      component.setState({ zoomLevel });
      expect(component.find(Img).prop('canDrag')).toEqual(false);
    });

    it('should mark image as isDragging when it is being dragged', () => {
      const { component, camera } = setup();
      const zoomLevel = new ZoomLevel(camera.scaleToFit * 1.5);
      component.setState({ zoomLevel });
      component.find(Img).simulate('mousedown', { screenX: 100, screenY: 100 });
      expect(component.find(Img).prop('isDragging')).toEqual(true);
    });

    it('should not mark image as isDragging when it is not being dragged', () => {
      const { component, camera } = setup();
      const zoomLevel = new ZoomLevel(camera.scaleToFit * 1.5);
      component.setState({ zoomLevel });
      expect(component.find(Img).prop('isDragging')).toEqual(false);
    });
  });

  it('should only apply image-rendering css props when zoom level greater than 1 (zoomed in)', () => {
    const { component } = setup({
      naturalWidth: 200,
      naturalHeight: 150,
    });

    expect(component.find(Img)).not.toHaveStyleRule(
      'image-rendering',
      'pixelated',
    );
    clickZoomIn(component);
    expect(component.find(Img)).toHaveStyleRule('image-rendering', 'pixelated');
  });

  it('should load non-binary resource first', () => {
    const { component } = setup({
      originalBinaryImageSrc: 'some-original-binary-url',
    });
    expect(component.find(Img).props().src).toEqual('some-src');
  });

  it('should not show HD button when no binaryUrl provided', () => {
    const { component } = setup();
    expect(component.find(HDIconGroupWrapper)).toHaveLength(0);
  });

  it('should not show HD button when displayed image is smaller then MAX Res', () => {
    const { component } = setup({
      originalBinaryImageSrc: 'some-original-binary-url',
      naturalWidth: 400,
      naturalHeight: 300,
    });
    expect(component.find(HDIconGroupWrapper)).toHaveLength(0);
  });

  it('should show inactive HD button when binaryUrl provided', () => {
    const { component } = setup({
      originalBinaryImageSrc: 'some-original-binary-url',
    });
    expect(component.find(HDIconGroupWrapper)).toHaveLength(1);
    const testId = component
      .find('[data-testid="hd-inactive"]')
      .last()
      .getDOMNode()
      .getAttribute('data-testid');
    expect(testId).toEqual('hd-inactive');
  });

  it('should show activating HD button when zoomed in after 100%', () => {
    const { component } = setup({
      originalBinaryImageSrc: 'some-original-binary-url',
    });

    // Zoom 6 times till it hits 100%
    for (let i = 0; i < 6; i++) {
      clickZoomIn(component);
    }
    const testId = component
      .find('[data-testid="hd-activating"]')
      .last()
      .getDOMNode()
      .getAttribute('data-testid');
    expect(testId).toEqual('hd-activating');
  });

  describe('when HD image is loaded', () => {
    let component: ReturnType<typeof setup>['component'];
    beforeEach(() => {
      const result = setup({
        originalBinaryImageSrc: 'some-original-binary-url',
      });
      component = result.component;

      // Zoom 6 times till it hits 100%
      for (let i = 0; i < 6; i++) {
        clickZoomIn(component);
      }

      callOnLoad(component, {
        naturalWidth: MAX_RESOLUTION * 2,
        naturalHeight: MAX_RESOLUTION * 0.75 * 2,
      });
    });

    it('should show active HD button when binary resource has loaded', () => {
      const HDButton = component
        .find('[data-testid="hd-active"]')
        .last()
        .getDOMNode();
      expect(HDButton).toBeDefined();
    });

    it('should load binary source', () => {
      expect(component.find(Img).props().src).toEqual(
        'some-original-binary-url',
      );
    });
  });
});

describe('analytics', () => {
  it('should raise onBlanketClicked when blanket clicked', () => {
    const { component, onBlanketClicked } = setup();
    component.find(ImageWrapper).simulate('click');
    expect(onBlanketClicked).toHaveBeenCalled();
  });
});

describe('zoomLevelAfterResize', () => {
  const sideLenGenerator = () => jsverify.integer(1, 10000);

  jsverify.property(
    'a fitted image will be resized to fit the new viewport',
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    (w1, h1, w2, h2) => {
      const originalImg = new Rectangle(800, 600);
      const oldViewport = new Rectangle(w1, h1);
      const newViewport = new Rectangle(w2, h2);

      const oldCamera = new Camera(oldViewport, originalImg);
      const newCamera = oldCamera.resizedViewport(newViewport);

      const oldZoomLevel = new ZoomLevel(oldCamera.scaleDownToFit);
      const newZoomLevel = zoomLevelAfterResize(
        newCamera,
        oldCamera,
        oldZoomLevel,
      );
      expect(newZoomLevel.value === newCamera.scaleDownToFit).toBeTruthy();
      return newZoomLevel.value === newCamera.scaleDownToFit;
    },
  );

  jsverify.property(
    'a non-fitted image will maintain its size when viewport is resized',
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    (w1, h1, w2, h2) => {
      const originalImg = new Rectangle(800, 600);
      const oldViewport = new Rectangle(w1, h1);
      const newViewport = new Rectangle(w2, h2);

      const oldCamera = new Camera(oldViewport, originalImg);
      const newCamera = oldCamera.resizedViewport(newViewport);

      const oldZoomLevel = new ZoomLevel(oldCamera.scaleDownToFit + 1);
      const newZoomLevel = zoomLevelAfterResize(
        newCamera,
        oldCamera,
        oldZoomLevel,
      );
      expect(newZoomLevel.value === oldZoomLevel.value).toBeTruthy();
      return newZoomLevel.value === oldZoomLevel.value;
    },
  );
});
