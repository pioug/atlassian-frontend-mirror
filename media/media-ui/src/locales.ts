/**
 * NOTE:
 *
 * The locale map used to be assembled from a generated `./i18n/index` barrel. That barrel was
 * removed as part of the one-export-per-file migration, so each locale module is now imported
 * directly here. The set of locales and their keys are unchanged.
 */
import cs from './i18n/cs';
import da from './i18n/da';
import de from './i18n/de';
import en from './i18n/en';
import en_GB from './i18n/en_GB';
import en_ZZ from './i18n/en_ZZ';
import es from './i18n/es';
import et from './i18n/et';
import fi from './i18n/fi';
import fr from './i18n/fr';
import hu from './i18n/hu';
import is from './i18n/is';
import it from './i18n/it';
import ja from './i18n/ja';
import ko from './i18n/ko';
import nb from './i18n/nb';
import nl from './i18n/nl';
import pl from './i18n/pl';
import pt_BR from './i18n/pt_BR';
import pt_PT from './i18n/pt_PT';
import ro from './i18n/ro';
import ru from './i18n/ru';
import sk from './i18n/sk';
import sv from './i18n/sv';
import th from './i18n/th';
import tr from './i18n/tr';
import uk from './i18n/uk';
import vi from './i18n/vi';
import zh from './i18n/zh';
import zh_TW from './i18n/zh_TW';

const locales: { [key: string]: any } = {
	zh,
	zh_TW,
	cs,
	da,
	nl,
	et,
	fi,
	fr,
	de,
	hu,
	it,
	ja,
	ko,
	nb,
	pl,
	pt_BR,
	pt_PT,
	ru,
	sk,
	es,
	sv,
	th,
	tr,
	uk,
	vi,
	en,
	en_GB,
	en_ZZ,
	is,
	ro,
};
export { locales };
