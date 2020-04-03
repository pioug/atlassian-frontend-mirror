# Image Placer

The ImagePlacer component provides a polished and flexible solution when
users require placement of an image inside a fixed area, such as avatar or header image selection.
The component is designed to work with mouse and touch events, respond to wheel events, is optimised
to handle large images, and can also respect Exif orientation values.

The component does **not** provide a slider or file input, that is something you will need to integrate
based on your requirements. This component focusses on zooming, panning, and rendered output of given images.

The main API is the `ImagePlacer` component, the `ImageActions` interface, and the `IMAGE_ERRORS` hash map. You can configure
the component with using the following props:

- `containerWidth: number` - the width of the final image
- `containerHeight: number` - the height of the final image
- `src: string | File` - you can pass an image src string, or a File (from a file input)
- `margin: number` - the spacing around the transparent container size, can be set to zero. Shape is determined by the `isCircular` prop
- `zoom: number` - the zoom level. Defaults to 0 (fully zoomed out)
- `maxZoom: number` - the maximum level of zoom possible to apply to image. Defaults to 2 (200%)
- `originX: number` - the horizontal pan offset
- `originY: number` - the vertical pan offset
- `useConstraints: boolean` - whether or not to apply constraints. Defaults to true (see **Constraints** section)
- `isCircular: boolean` - whether or not the margin shape is circular. Defaults to false (square)
- `useCircularClipWithActions: boolean` - whether or not to render image with circular clip of background color. Defaults to false.
- `backgroundColor: string` - the background color of container. Defaults to transparent
- `onImageChange: (imageElement: HTMLImageElement) => void` - called when image changes
- `onZoomChange: (zoom: number) => void` - called when zoom changes
- `onImageActions: (actions: ImageActions) => void` - called initially to provide an api of actions to access the image at current view
- `onRenderError: (errorMessage: string) => JSX.Element` - used to override default error rendering, in case you have specific requirements. Defaults to plain error message.

## Constraints

If `useConstraints` prop is true, the image will never be smaller than the visible bounds (container size - margins). The edges will be constrained to never go inside that region.
If this prop is set to false then the image can be moved around freely at natural size (though it will be constrained to outer edges of visible bounds to prevent image disapearing).

## Actions

If you want to access the image at any time outside of React's lifecycles, just provide the `onImageActions` callback and you will receive
and object containing the following `ImageActions` interface:

- `toCanvas: () => HTMLCanvasElement` - return a new HTMLCanvas which has the image rendered at current view
- `toDataURL: () => string` - return a dataURL string of the image rendered at current view, which you could use as an image src
- `toFile: () => File` - return a `File` object with the same data as `toDataURL`. Useful for uploading blobs.
