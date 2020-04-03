export const AC_XMLNS = 'http://example.com/ac';
export const RI_XMLNS = 'http://example.com/ri';
export const FAB_XMLNS = 'http://example.com/fab';
export const XHTML_XMLNS = 'http://www.w3.org/1999/xhtml';

export default function(node: Node): string {
  // The naive approach here is to simply call .outerHTML on a node, however this has an undesirable
  // behaviour of including the xmlns:* attributes on the node. Confluence Storage Format expects that
  // these are *not* included.
  //
  // To avoid including these, we fall back to hacky plain text slicing. The strategy is to included
  // some wrapper elements that will contain the xmlns:* attributes. A document will be structured as:
  //
  //     <wrapper xmlns="http://www.w3.org/1999/xhtml">
  //       <fab:wrapper xmlns="http://example.com/fab">
  //         <ac:wrapper xmlns="http://example.com/ac">
  //           <ri:wrapper xmlns="http://example.com/ri">
  //             …
  //           </ri:wrapper>
  //         </ac:wrapper>
  //       </fab:wrapper>
  //     </wrapper>
  //
  // Before content is added, `.outerHTML` of the `ac:wrapper` is used to determine the number of
  // leading/trailing bytes need to be trimmed in the final result (to remove the wrappers).
  //
  // WARNING: This method will move `element` into a new parent element, but will put it back
  // before returning.
  const doc = node.ownerDocument!;
  const marker = doc.createElement('marker');

  if (node.parentNode) {
    node.parentNode.replaceChild(marker, node);
  }

  const wrapper = doc.createElementNS(XHTML_XMLNS, 'wrapper');
  const acWrapper = doc.createElementNS(AC_XMLNS, 'ac:wrapper');
  const riWrapper = doc.createElementNS(RI_XMLNS, 'ri:wrapper');
  const fabWrapper = doc.createElementNS(FAB_XMLNS, 'fab:wrapper');

  wrapper.appendChild(fabWrapper);
  fabWrapper.appendChild(acWrapper);
  acWrapper.appendChild(riWrapper);

  // Force avoid self-closing tags, as these would invalidate suffix/prefix length calculations.
  const wedge = '|';
  const wedgeText = doc.createTextNode(wedge);
  riWrapper.appendChild(wedgeText);
  const template = wrapper.outerHTML;
  const prefixLength = template.indexOf(wedge);
  const suffixLength = template.length - prefixLength - wedge.length;

  riWrapper.removeChild(wedgeText);
  riWrapper.appendChild(node);

  const wrappedResult = wrapper.outerHTML;
  const result = wrappedResult.slice(
    prefixLength,
    wrappedResult.length - suffixLength,
  );

  if (marker.parentNode) {
    marker.parentNode.replaceChild(node, marker);
  }

  return result.replace(/\s\/>/g, '/>'); // Remove unnecessary white-space added by IE
}
