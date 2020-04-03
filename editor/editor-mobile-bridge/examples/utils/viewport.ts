export function disableZooming() {
  // Prevent page zooming. We do this here because the default meta viewport
  // shared by all package's examples deliberately allows zooming, but we
  // wish to disable it for mobile editor.
  const viewportMeta = document.head!.querySelector('[name=viewport]');
  if (viewportMeta) {
    const content = viewportMeta.getAttribute('content');
    if (content && content.indexOf('user-scalable=no') === -1) {
      viewportMeta.setAttribute('content', `${content}, user-scalable=no`);
    }
  }
}
