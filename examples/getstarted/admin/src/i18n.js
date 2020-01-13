/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your plugin.
 *
 */

import { addLocaleData } from 'react-intl';
import { reduce } from 'lodash';

// We need to manually import the locales here
// because dynamic imports causes webpack to build all the locales
// see https://github.com/yahoo/react-intl/issues/1225
import en from 'react-intl/locale-data/en';

import trads from './translations';

// We dismiss pt-BR and zh-Hans locales since they are not supported by react-intl
const locales = {
  en,
};

const languages = Object.keys(trads);

/**
 * Dynamically generate `translationsMessages object`.
 */
const translationMessages = reduce(
  languages,
  (result, language) => {
    const obj = result;
    obj[language] = trads[language];

    if (locales[language]) {
      addLocaleData(locales[language]);
    }

    return obj;
  },
  {}
);

export { languages, translationMessages };
