import React from 'react';
import { create } from 'react-test-renderer';
import { EditorPresetCXHTML } from '../../cxhtml';
import { EditorPresetMobile } from '../../mobile';

describe('next/presets', () => {
  describe('cxhtml preset', () => {
    it('should not blow up', async () => {
      expect(() => {
        const renderer = create(<EditorPresetCXHTML />);
        renderer.unmount();
      }).not.toThrow();
    });
  });

  describe('mobile preset', () => {
    it('should not blow up', async () => {
      expect(() => {
        const renderer = create(<EditorPresetMobile />);
        renderer.unmount();
      }).not.toThrow();
    });
  });
});
