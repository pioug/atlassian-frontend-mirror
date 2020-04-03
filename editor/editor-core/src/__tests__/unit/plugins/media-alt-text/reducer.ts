import reducer from '../../../../plugins/media/pm-plugins/alt-text/reducer';

describe('media alt text', () => {
  describe('reducer', () => {
    it('should openMediaAltTextMenu', () => {
      expect(
        reducer(
          {
            isAltTextEditorOpen: false,
          },
          {
            type: 'openMediaAltTextMenu',
          },
        ),
      ).toEqual({ isAltTextEditorOpen: true });
    });

    it('should closeMediaAltTextMenu', () => {
      expect(
        reducer(
          {
            isAltTextEditorOpen: true,
          },
          {
            type: 'closeMediaAltTextMenu',
          },
        ),
      ).toEqual({ isAltTextEditorOpen: false });
    });

    it('should not change isAltTextEditorOpen after updateAltText', () => {
      expect(
        reducer(
          {
            isAltTextEditorOpen: false,
          },
          {
            type: 'updateAltText',
          },
        ),
      ).toEqual({ isAltTextEditorOpen: false });
      expect(
        reducer(
          {
            isAltTextEditorOpen: true,
          },
          {
            type: 'updateAltText',
          },
        ),
      ).toEqual({ isAltTextEditorOpen: true });
    });
  });
});
