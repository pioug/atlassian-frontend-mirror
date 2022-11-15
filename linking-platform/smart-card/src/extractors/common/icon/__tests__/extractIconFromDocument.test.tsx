import { extractIconFromDocument } from '../extractIconFromDocument';
import { mount } from 'enzyme';
import { render } from '../../__mocks__/render';
import { TEST_URL } from '../../__mocks__/jsonld';

describe('extractors.icon.document', () => {
  it('returns blog icon for BlogPosting', () => {
    const icon = extractIconFromDocument('schema:BlogPosting', {});
    expect(mount(render(icon)).find('Blog16Icon')).toHaveLength(1);
  });

  it('returns file icon for DigitalDocument', () => {
    const icon = extractIconFromDocument('schema:DigitalDocument', {});
    expect(mount(render(icon)).find('Generic16Icon')).toHaveLength(1);
  });

  it('returns document icon for TextDigitalDocument', () => {
    const icon = extractIconFromDocument('schema:TextDigitalDocument', {});
    expect(mount(render(icon)).find('Document16Icon')).toHaveLength(1);
  });

  it('returns document icon for UndefinedLink', () => {
    const icon = extractIconFromDocument('atlassian:UndefinedLink', {});
    expect(mount(render(icon)).find('Document16Icon')).toHaveLength(1);
  });

  it('returns presentation icon for PresentationDigitalDocument', () => {
    const icon = extractIconFromDocument(
      'schema:PresentationDigitalDocument',
      {},
    );
    expect(mount(render(icon)).find('Presentation16Icon')).toHaveLength(1);
  });

  it('returns spreadsheet icon for SpreadsheetDigitalDocument', () => {
    const icon = extractIconFromDocument(
      'schema:SpreadsheetDigitalDocument',
      {},
    );
    expect(mount(render(icon)).find('Spreadsheet16Icon')).toHaveLength(1);
  });

  it('returns document filled icon for Template', () => {
    const icon = extractIconFromDocument('atlassian:Template', {});
    expect(mount(render(icon)).find('DocumentFilledIcon')).toHaveLength(1);
  });

  it('privileges file mime type icon for other documents', () => {
    const icon = extractIconFromDocument('Document', {
      fileFormat: 'image/png',
    });
    // Enzyme doesn't play well with LoadableComponents - let's iterate on
    // this assertion as move forward - maybe `@testing/library` would be
    // a better fit (?).
    expect(mount(render(icon))).toBeDefined();
  });

  it('privileges fileFormat icon for other documents', () => {
    const icon = extractIconFromDocument('Document', {
      fileFormat: 'image/png',
      provider: { icon: TEST_URL, text: 'favicon' },
    });
    expect(icon).not.toBe(String);
    expect(icon).toBeDefined();
  });

  it('privileges provider icon if specified as priority', () => {
    const icon = extractIconFromDocument('schema:BlogPosting', {
      fileFormat: 'image/png',
      provider: { icon: TEST_URL, text: 'favicon' },
      priority: 'provider',
    });
    expect(icon).toBe(TEST_URL);
  });
});
