import type { ElementHandle } from 'puppeteer';
import invariant from 'tiny-invariant';

export async function getElement(
  selector: string,
): Promise<ElementHandle<Element>> {
  const handle = await page.$(selector);
  invariant(handle, `Unable to find element with selector: ${selector}`);
  return handle;
}
