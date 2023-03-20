import { Identifier, isFileIdentifier } from '@atlaskit/media-client';
import { normaliseInput } from '../normaliseInput';

const collectionName = 'some-collection';

const file: Identifier = {
  id: 'some-id',
  mediaItemType: 'file',
};

const fileNormalised: Identifier = {
  id: 'some-id',
  mediaItemType: 'file',
  collectionName,
};

const externalImage: Identifier = {
  dataURI: 'some-data-uri',
  mediaItemType: 'external-image',
};

const anotherFile: Identifier = {
  id: 'another-id',
  mediaItemType: 'file',
};
const anotherFileNormalised: Identifier = {
  id: 'another-id',
  mediaItemType: 'file',
  collectionName,
};

describe('normaliseInput', () => {
  it('adds the collection name to the selected item', () => {
    const { normalisedSelectedItem } = normaliseInput({
      selectedItem: file,
      collectionName,
    });

    expect(
      isFileIdentifier(normalisedSelectedItem) &&
        normalisedSelectedItem.collectionName,
    ).toBe(collectionName);
  });

  it(`does not add the collection name to the selected item if it's external image`, () => {
    const { normalisedSelectedItem } = normaliseInput({
      selectedItem: externalImage,
      collectionName,
    });

    expect((normalisedSelectedItem as any).collectionName).not.toBe(
      collectionName,
    );
  });

  it(`returns a list with the selected item if no list was provided`, () => {
    const { normalisedItems, normalisedSelectedItem } = normaliseInput({
      selectedItem: file,
      collectionName,
    });

    expect(
      !!normalisedItems && normalisedItems.includes(normalisedSelectedItem),
    ).toBe(true);
  });

  it(`adds the collection name to the files in the items and attaches the selected item (file identifier)`, () => {
    const { normalisedItems, normalisedSelectedItem } = normaliseInput({
      selectedItem: file,
      collectionName,
      items: [anotherFile, externalImage],
    });

    expect(normalisedItems).toEqual([
      normalisedSelectedItem,
      anotherFileNormalised,
      externalImage,
    ]);
  });

  it(`adds the collection name to the files in the items and attaches the selected item (external image identifier)`, () => {
    const { normalisedItems } = normaliseInput({
      selectedItem: externalImage,
      collectionName,
      items: [file, anotherFile],
    });

    expect(normalisedItems).toEqual([
      externalImage,
      fileNormalised,
      anotherFileNormalised,
    ]);
  });

  it(`does not reattach the selected item in items (file identifier)`, () => {
    const { normalisedItems, normalisedSelectedItem } = normaliseInput({
      selectedItem: file,
      collectionName,
      items: [anotherFile, { ...file }, externalImage],
    });

    expect(normalisedItems).toEqual([
      anotherFileNormalised,
      normalisedSelectedItem,
      externalImage,
    ]);
  });

  it(`does not reattach the selected item in items (external image identifier)`, () => {
    const { normalisedItems } = normaliseInput({
      selectedItem: externalImage,
      collectionName,
      items: [file, { ...externalImage }, anotherFile],
    });

    expect(normalisedItems).toEqual([
      fileNormalised,
      externalImage,
      anotherFileNormalised,
    ]);
  });

  describe('with datasource list', () => {
    it('uses items before datasource list if both are provided', () => {
      const { normalisedItems, normalisedSelectedItem } = normaliseInput({
        selectedItem: file,
        collectionName,
        items: [anotherFile, externalImage],
        dataSource: { list: [] },
      });

      expect(normalisedItems).toEqual([
        normalisedSelectedItem,
        anotherFileNormalised,
        externalImage,
      ]);
    });

    it(`adds the collection name to the files in the datasource list and attaches the selected item (file identifier)`, () => {
      const { normalisedItems, normalisedSelectedItem } = normaliseInput({
        selectedItem: file,
        collectionName,
        dataSource: { list: [anotherFile, externalImage] },
      });

      expect(normalisedItems).toEqual([
        normalisedSelectedItem,
        anotherFileNormalised,
        externalImage,
      ]);
    });

    it(`adds the collection name to the files in the datasource list and attaches the selected item (external image identifier)`, () => {
      const { normalisedItems } = normaliseInput({
        selectedItem: externalImage,
        collectionName,
        dataSource: { list: [file, anotherFile] },
      });

      expect(normalisedItems).toEqual([
        externalImage,
        fileNormalised,
        anotherFileNormalised,
      ]);
    });

    it(`does not reattach the selected item in the datasource list (file identifier)`, () => {
      const { normalisedItems, normalisedSelectedItem } = normaliseInput({
        selectedItem: file,
        collectionName,
        dataSource: { list: [anotherFile, file, externalImage] },
      });

      expect(normalisedItems).toEqual([
        anotherFileNormalised,
        normalisedSelectedItem,
        externalImage,
      ]);
    });

    it(`does not reattach the selected item in the datasource list (external image identifier)`, () => {
      const { normalisedItems } = normaliseInput({
        selectedItem: externalImage,
        collectionName,
        dataSource: { list: [file, externalImage, anotherFile] },
      });

      expect(normalisedItems).toEqual([
        fileNormalised,
        externalImage,
        anotherFileNormalised,
      ]);
    });
  });

  describe('with datasource collection', () => {
    it('uses items if provided together with datasource collection', () => {
      const { normalisedItems, normalisedSelectedItem } = normaliseInput({
        selectedItem: file,
        collectionName,
        items: [anotherFile, externalImage],
        dataSource: { list: [], collectionName: 'some-datasource-collection' },
      });

      expect(normalisedItems).toEqual([
        normalisedSelectedItem,
        anotherFileNormalised,
        externalImage,
      ]);
    });

    it('uses datasource list if provided together with datasource collection', () => {
      const { normalisedItems, normalisedSelectedItem } = normaliseInput({
        selectedItem: file,
        collectionName,
        dataSource: {
          list: [anotherFile, externalImage],
          collectionName: 'some-datasource-collection',
        },
      });

      expect(normalisedItems).toEqual([
        normalisedSelectedItem,
        anotherFileNormalised,
        externalImage,
      ]);
    });

    it('returns no list if datasource collection is provided', () => {
      const { normalisedItems } = normaliseInput({
        selectedItem: file,
        collectionName,
        dataSource: {
          collectionName: 'some-datasource-collection',
        },
      });

      expect(normalisedItems).toBeUndefined();
    });

    it('returns a list if selected item is external identifier and datasource collection is provided', () => {
      const { normalisedItems } = normaliseInput({
        selectedItem: externalImage,
        collectionName,
        dataSource: {
          collectionName: 'some-datasource-collection',
        },
      });

      expect(normalisedItems).toEqual([externalImage]);
    });
  });
});
