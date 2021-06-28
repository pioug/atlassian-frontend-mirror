function getNodeName(node: Node | null | undefined): string | null | undefined {
  return node && node.nodeName.toUpperCase();
}

function isMedia(node: Node | null): boolean {
  if (!node) {
    return false;
  }
  if (getNodeName(node) === 'SPAN' && node instanceof HTMLElement) {
    return !!node.querySelector(
      'a > jira-attachment-thumbnail > img[data-attachment-type="thumbnail"], ' +
        'a[data-attachment-type="file"]',
    );
  }
  return false;
}

function repairParagraph(p: HTMLParagraphElement) {
  const paragraphs: Array<Array<Node>> = [];
  let buffer: Array<Node> = [];
  let mediaGroupFound = false;
  let skipBuffer = false;

  const processMedia = () => {
    if (buffer.length) {
      const head = buffer[0];
      if (getNodeName(head) === 'BR') {
        buffer.shift();
      }
      paragraphs.push(buffer);
      buffer = [];
    }
  };

  for (let i = 0, length = p.childNodes.length; i < length; i++) {
    const node = p.childNodes[i];
    skipBuffer = false;
    // [..., M, BR, ...]
    if (getNodeName(node) === 'BR') {
      // [mmm, M, BR, ...]
      if (mediaGroupFound) {
        processMedia();
        mediaGroupFound = false;
        skipBuffer = true;
      }
      // [..., BR, M, ...]
      if (isMedia(node.nextSibling)) {
        mediaGroupFound = true;
        if (buffer.length) {
          paragraphs.push(buffer);
          buffer = [];
        }
      }
    } else if (isMedia(node)) {
      // [M, ...]
      if (node.previousSibling === null) {
        mediaGroupFound = true;
      }
    } else {
      if (mediaGroupFound) {
        // Skip white space characters inside media
        if (
          getNodeName(node) === '#TEXT' &&
          (node.textContent || '').trim() === ''
        ) {
          continue;
        }
        buffer = (paragraphs.pop() || []).concat(buffer);
        mediaGroupFound = false;
      }
    }
    if (!skipBuffer) {
      buffer.push(node);
    }
  }

  if (mediaGroupFound) {
    processMedia();
  } else {
    paragraphs.push(buffer);
  }

  if (paragraphs.length > 1) {
    const fragment = document.createDocumentFragment();
    paragraphs.forEach((childP) => {
      const innerP = document.createElement('p');
      childP.forEach((child) => innerP.appendChild(child));
      fragment.appendChild(innerP);
    });

    // Replace old P
    const parent = p.parentNode!;
    parent.insertBefore(fragment, p.nextSibling);
    // IE11 doesn't support remove
    parent.removeChild(p);
  }
}

export default function (doc: Document): Document {
  const paragraphs = doc.querySelectorAll('p');
  for (let i = 0, length = paragraphs.length; i < length; i++) {
    repairParagraph(paragraphs[i]);
  }
  return doc;
}
