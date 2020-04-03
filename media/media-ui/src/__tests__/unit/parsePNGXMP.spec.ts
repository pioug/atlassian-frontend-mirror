import { parseXMPMetaData } from '../../imageMetaData/parsePNGXMP';

describe('Image MetaData PNG XMP', () => {
  describe('parsePNGXMP()', () => {
    const xmpData = `XML:com.adobe.xmp<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.4.0">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
     <rdf:Description rdf:about=""
           xmlns:xmp="http://ns.adobe.com/xap/1.0/"
           xmlns:tiff="http://ns.adobe.com/tiff/1.0/"
           xmlns:exif="http://ns.adobe.com/exif/1.0/">
        <xmp:ModifyDate>2018-09-18T13:09:07</xmp:ModifyDate>
        <xmp:CreatorTool>Pixelmator 3.7.4</xmp:CreatorTool>
        <tiff:Orientation>1</tiff:Orientation>
        <tiff:Compression>2</tiff:Compression>
        <tiff:ResolutionUnit>3</tiff:ResolutionUnit>
        <tiff:YResolution>4</tiff:YResolution>
        <tiff:XResolution>5</tiff:XResolution>
        <exif:PixelXDimension>6</exif:PixelXDimension>
        <exif:ColorSpace>7</exif:ColorSpace>
        <exif:PixelYDimension>8</exif:PixelYDimension>
     </rdf:Description>
  </rdf:RDF>
  </x:xmpmeta>`;

    const badXmpData = `...ption rdf:about=""
           xmlns:xmp="http://ns.adobe.com/xap/1.0/"
           xmlns:tiff="http://ns.adobe.com/tiff/1.0/"
           xmlns:exif="http://ns.adobe.com/exif/1.0/">
        <xmp:ModifyDate>2018-09-18T13:09:07***/xmp:ModifyDate>
        <xmp:CreatorTool...`;

    it('should find tags in XML string', () => {
      const tags = parseXMPMetaData(xmpData);
      expect(Object.keys(tags)).toMatchObject([
        'Orientation',
        'Compression',
        'ResolutionUnit',
        'YResolution',
        'XResolution',
        'PixelXDimension',
        'ColorSpace',
        'PixelYDimension',
      ]);
      expect(tags.Orientation).toBe('1');
      expect(tags.Compression).toBe('2');
      expect(tags.ResolutionUnit).toBe('3');
      expect(tags.YResolution).toBe('4');
      expect(tags.XResolution).toBe('5');
      expect(tags.PixelXDimension).toBe('6');
      expect(tags.ColorSpace).toBe('7');
      expect(tags.PixelYDimension).toBe('8');
    });

    it('should handle empty strings', () => {
      const tags = parseXMPMetaData('');
      expect(tags).toEqual({});
    });

    it('should handle bad XMP data', () => {
      const tags = parseXMPMetaData(badXmpData);
      expect(tags).toEqual({});
    });
  });
});
