import { en, fr, pt_BR } from '../../../i18n';
import { getMessagesForLocale } from '../../i18n-util';

describe('i18n', () => {
  it('should resolve country[underscore]territory locale', () => {
    const messages = getMessagesForLocale('pt_BR');
    expect(messages).toBe(pt_BR);
  });

  it('should resolve country[dash]territory locale', () => {
    const messages = getMessagesForLocale('pt-BR');
    expect(messages).toBe(pt_BR);
  });

  it('should resolve locale by country if territory cannot be found', () => {
    const messages = getMessagesForLocale('fr_FR' as any);
    expect(messages).toBe(fr);
  });

  it('should fallback to EN if locale cannot be found', () => {
    const messages = getMessagesForLocale('HUG_HUG' as any);
    expect(messages).toBe(en);
  });
});
