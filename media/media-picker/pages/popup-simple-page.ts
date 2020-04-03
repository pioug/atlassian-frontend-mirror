import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { PopupUploadEventPayloadMap } from '../src/types';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { MediaPickerPageObject } from '@atlaskit/media-integration-test-helpers';

type Event = {
  readonly name: string;
  readonly payload: any;
};

/**
 * Popup Simple Example Page Object
 * @see https://www.seleniumhq.org/docs/06_test_design_considerations.jsp#page-object-design-pattern
 */
export class PopupSimplePage extends Page {
  mediaPicker: MediaPickerPageObject;

  constructor(browserObject: BrowserObject) {
    super(browserObject);
    this.mediaPicker = new MediaPickerPageObject(this);
  }

  async getEvents(): Promise<Event[]> {
    return JSON.parse(await this.getText('#events'));
  }

  async getEvent(name: keyof PopupUploadEventPayloadMap): Promise<Event> {
    await this.waitUntil(async () =>
      (await this.getEvents()).some(eventWithName(name)),
    );

    const events = await this.getEvents();

    const event = events.find(eventWithName(name));
    if (event) {
      return event;
    } else {
      throw new Error(`Event ${name} not found`);
    }
  }
}

export async function gotoPopupSimplePage(
  client: ConstructorParameters<typeof Page>[0],
): Promise<PopupSimplePage> {
  const page = new PopupSimplePage(client);
  const url = getExampleUrl('media', 'media-picker', 'popup-simple');
  await page.goto(url);
  await page.isVisible('[data-testid="media-picker-popup"]');
  return page;
}

function eventWithName(name: string) {
  return (event: Event) => event.name === name;
}
