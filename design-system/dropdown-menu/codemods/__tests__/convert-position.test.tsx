import convertPosition from '../utils/convert-position';

describe('convert old position notation', () => {
  describe('edge cases', () => {
    it('fallback to bottom-start', () => {
      const position = convertPosition('unknown');
      expect(position).toBe('bottom-start');
    });

    it('fallback to bottom-start', () => {
      const position = convertPosition();
      expect(position).toBe('bottom-start');
    });

    it('trim', () => {
      const position = convertPosition(' top left ');
      expect(position).toBe('top-start');
    });
  });

  describe('convert top', () => {
    it('convert top left', () => {
      const position = convertPosition('top left');
      expect(position).toBe('top-start');
    });

    it('convert top center', () => {
      const position = convertPosition('top center');
      expect(position).toBe('top');
    });

    it('convert top right', () => {
      const position = convertPosition('top right');
      expect(position).toBe('top-end');
    });
  });

  describe('convert right', () => {
    it('convert right top', () => {
      const position = convertPosition('right top');
      expect(position).toBe('right-start');
    });

    it('convert right middle', () => {
      const position = convertPosition('right middle');
      expect(position).toBe('right');
    });

    it('convert right bottom', () => {
      const position = convertPosition('right bottom');
      expect(position).toBe('right-end');
    });
  });

  describe('convert bottom', () => {
    it('convert bottom left', () => {
      const position = convertPosition('bottom left');
      expect(position).toBe('bottom-start');
    });

    it('convert bottom center', () => {
      const position = convertPosition('bottom center');
      expect(position).toBe('bottom');
    });

    it('convert bottom right', () => {
      const position = convertPosition('bottom right');
      expect(position).toBe('bottom-end');
    });
  });

  describe('convert left', () => {
    it('convert left top', () => {
      const position = convertPosition('left top');
      expect(position).toBe('left-start');
    });

    it('convert left middle', () => {
      const position = convertPosition('left middle');
      expect(position).toBe('left');
    });

    it('convert left bottom', () => {
      const position = convertPosition('left bottom');
      expect(position).toBe('left-end');
    });
  });
});
