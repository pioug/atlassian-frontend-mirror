import { processImages, createContentId } from '..';
import * as icons from '../icons';
import { base64Prefix, imageOutputType } from '../generator/constants';

describe('static asset rendering tests', () => {
  it('processImages: should have expected embeddedImages array', () => {
    const contentId = createContentId('info');
    const htmlTestString = `<html><img src="${contentId}" /></html>`;
    const output = processImages(htmlTestString, false);

    // htmlTestString should remain unchanged!
    expect(output.result).toMatch(htmlTestString);

    // this should contain data necessary to create inline email attachments
    expect(output.embeddedImages).toEqual([
      {
        contentId: 'csg-icon-info',
        contentType: `image/${imageOutputType}`,
        data: icons.info,
      },
    ]);
  });

  it('processImages: should replace image source with inline source when mock enabled', () => {
    const contentId = createContentId('info');
    const htmlTestString = `<html><img src="${contentId}" /></html>`;
    const output = processImages(htmlTestString, true);

    // image src should be base64 inline data uri
    expect(output.result).toMatch(
      `<html><img src="${base64Prefix}${icons.info}" /></html>`,
    );

    // embeddedImages is irrelevant for mock mode
    expect(output.embeddedImages).toEqual([]);
  });

  // these tests make sure that the generator does not spew out something unexpected
  it('generator: icons match snapshots', () => {
    for (const icon in icons.IconName) {
      expect(icons[icon as icons.IconString]).toMatchSnapshot(icon);
    }
  });

  it('createContentId: should create contentIds as expected', () => {
    expect(createContentId('info')).toEqual('cid:csg-icon-info');
    expect(createContentId('info')).toEqual('cid:csg-icon-info');
    expect(createContentId('note')).toEqual('cid:csg-icon-note');
    expect(createContentId('error')).toEqual('cid:csg-icon-error');
    expect(createContentId('error')).toEqual('cid:csg-icon-error');
    expect(createContentId('error', false)).toEqual('csg-icon-error');
  });
});
