/**
 * Check if the element is in the VC ignore if no layout shift marker.
 * @param element - The element to check.
 * @returns True if the element has the data-vc-ignore-if-no-layout-shift attribute == 'true or its parent has it, false otherwise.
 */
export default function isInVCIgnoreIfNoLayoutShiftMarker(element: HTMLElement | null | undefined): boolean {
    if (!element) {
        return false;
    }

    return element.getAttribute('data-vc-ignore-if-no-layout-shift') === 'true' || isInVCIgnoreIfNoLayoutShiftMarker(element.parentElement);
}