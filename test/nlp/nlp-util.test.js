/*
 * Copyright (c) AXA Shared Services Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const Natural = require('natural');
const { NlpUtil } = require('../../lib');

describe('NLP Util', () => {
  describe('Get truncated locale', () => {
    test('Should return undefined if no locale provided', () => {
      expect(NlpUtil.getTruncatedLocale()).toBeUndefined();
      expect(NlpUtil.getTruncatedLocale(null)).toBeUndefined();
      expect(NlpUtil.getTruncatedLocale('')).toBeUndefined();
    });
    test('Should return the first 2 characters lowercase', () => {
      expect(NlpUtil.getTruncatedLocale('e')).toEqual('e');
      expect(NlpUtil.getTruncatedLocale('es')).toEqual('es');
      expect(NlpUtil.getTruncatedLocale('ESP')).toEqual('es');
    });
  });

  describe('Get Stemmer', () => {
    test('Should return correct stemmer for the locale', () => {
      expect(NlpUtil.getStemmer('en')).toBe(Natural.PorterStemmer); // english
      expect(NlpUtil.getStemmer('fa')).toBe(Natural.PorterStemmerFa); // farsi
      expect(NlpUtil.getStemmer('fr')).toBe(Natural.PorterStemmerFr); // french
      expect(NlpUtil.getStemmer('ru')).toBe(Natural.PorterStemmerRu); // russian
      expect(NlpUtil.getStemmer('es')).toBe(Natural.PorterStemmerEs); // spanish
      expect(NlpUtil.getStemmer('it')).toBe(Natural.PorterStemmerIt); // italian
      expect(NlpUtil.getStemmer('no')).toBe(Natural.PorterStemmerNo); // norwegian
      expect(NlpUtil.getStemmer('pt')).toBe(Natural.PorterStemmerPt); // portugese
      expect(NlpUtil.getStemmer('sv')).toBe(Natural.PorterStemmerSv); // swedish
      expect(NlpUtil.getStemmer('nl')).toBe(Natural.PorterStemmerNl); // Dutch
      expect(NlpUtil.getStemmer('id')).toBe(Natural.PorterStemmerId); // Indonesian
      expect(NlpUtil.getStemmer('ja')).toBeInstanceOf(Natural.StemmerJa); // Japanese
      expect(NlpUtil.getStemmer('da').constructor.name).toEqual('DanishStemmer'); // Danish
      expect(NlpUtil.getStemmer('fi').constructor.name).toEqual('FinnishStemmer'); // Finnish
      expect(NlpUtil.getStemmer('de').constructor.name).toEqual('GermanStemmer'); // German
      expect(NlpUtil.getStemmer('hu').constructor.name).toEqual('HungarianStemmer'); // Hungarian
      expect(NlpUtil.getStemmer('ro').constructor.name).toEqual('RomanianStemmer'); // Romanian
      expect(NlpUtil.getStemmer('tr').constructor.name).toEqual('TurkishStemmer'); // Turkish
    });
    test('Shoul return a PorterStemmer for unknown locales', () => {
      expect(NlpUtil.getStemmer('aa')).toBe(Natural.PorterStemmer);
      expect(NlpUtil.getStemmer('')).toBe(Natural.PorterStemmer);
      expect(NlpUtil.getStemmer()).toBe(Natural.PorterStemmer);
    });
    test('Alternative stemmers can be used for some languages', () => {
      NlpUtil.useAlternative.en = true;
      NlpUtil.useAlternative.fa = true;
      NlpUtil.useAlternative.fr = true;
      NlpUtil.useAlternative.ru = true;
      NlpUtil.useAlternative.es = true;
      NlpUtil.useAlternative.it = true;
      NlpUtil.useAlternative.nl = true;
      NlpUtil.useAlternative.no = true;
      NlpUtil.useAlternative.pt = true;
      NlpUtil.useAlternative.pl = true;
      NlpUtil.useAlternative.sv = true;
      NlpUtil.useAlternative.id = true;
      NlpUtil.useAlternative.ja = true;
      NlpUtil.useAlternative.da = true;
      NlpUtil.useAlternative.fi = true;
      NlpUtil.useAlternative.de = true;
      NlpUtil.useAlternative.hu = true;
      NlpUtil.useAlternative.ro = true;
      NlpUtil.useAlternative.tr = true;
      expect(NlpUtil.getStemmer('en').constructor.name).toEqual('EnglishStemmer'); // english
      expect(NlpUtil.getStemmer('fa')).toBe(Natural.PorterStemmerFa); // farsi
      expect(NlpUtil.getStemmer('fr').constructor.name).toEqual('FrenchStemmer'); // french
      expect(NlpUtil.getStemmer('ru').constructor.name).toEqual('RussianStemmer'); // russian
      expect(NlpUtil.getStemmer('es').constructor.name).toEqual('SpanishStemmer'); // spanish
      expect(NlpUtil.getStemmer('it').constructor.name).toEqual('ItalianStemmer'); // italian
      expect(NlpUtil.getStemmer('no').constructor.name).toEqual('NorwegianStemmer'); // norwegian
      expect(NlpUtil.getStemmer('pt').constructor.name).toEqual('PortugueseStemmer'); // portugese
      expect(NlpUtil.getStemmer('sv').constructor.name).toEqual('SwedishStemmer'); // swedish
      expect(NlpUtil.getStemmer('nl').constructor.name).toEqual('DutchStemmer'); // Dutch
      expect(NlpUtil.getStemmer('id')).toBe(Natural.PorterStemmerId); // Indonesian
      expect(NlpUtil.getStemmer('ja')).toBeInstanceOf(Natural.StemmerJa); // Japanese
      expect(NlpUtil.getStemmer('da').constructor.name).toEqual('DanishStemmer'); // Danish
      expect(NlpUtil.getStemmer('fi').constructor.name).toEqual('FinnishStemmer'); // Finnish
      expect(NlpUtil.getStemmer('de').constructor.name).toEqual('GermanStemmer'); // German
      expect(NlpUtil.getStemmer('hu').constructor.name).toEqual('HungarianStemmer'); // Hungarian
      expect(NlpUtil.getStemmer('ro').constructor.name).toEqual('RomanianStemmer'); // Romanian
      expect(NlpUtil.getStemmer('tr').constructor.name).toEqual('TurkishStemmer'); // Turkish
      NlpUtil.useAlternative.en = false;
      NlpUtil.useAlternative.fa = false;
      NlpUtil.useAlternative.fr = false;
      NlpUtil.useAlternative.ru = false;
      NlpUtil.useAlternative.es = false;
      NlpUtil.useAlternative.it = false;
      NlpUtil.useAlternative.nl = false;
      NlpUtil.useAlternative.no = false;
      NlpUtil.useAlternative.pt = false;
      NlpUtil.useAlternative.pl = false;
      NlpUtil.useAlternative.sv = false;
      NlpUtil.useAlternative.id = false;
      NlpUtil.useAlternative.ja = false;
      NlpUtil.useAlternative.da = false;
      NlpUtil.useAlternative.fi = false;
      NlpUtil.useAlternative.de = false;
      NlpUtil.useAlternative.hu = false;
      NlpUtil.useAlternative.ro = false;
      NlpUtil.useAlternative.tr = false;
    });
  });

  describe('Get tokenizer', () => {
    test('Should return correct tokenizer for the locale', () => {
      expect(NlpUtil.getTokenizer('en')).toBeInstanceOf(Natural.AggressiveTokenizer); // english
      expect(NlpUtil.getTokenizer('fa')).toBeInstanceOf(Natural.AggressiveTokenizerFa); // farsi
      expect(NlpUtil.getTokenizer('fr')).toBeInstanceOf(Natural.AggressiveTokenizerFr); // french
      expect(NlpUtil.getTokenizer('ru')).toBeInstanceOf(Natural.AggressiveTokenizerRu); // russian
      expect(NlpUtil.getTokenizer('es')).toBeInstanceOf(Natural.AggressiveTokenizerEs); // spanish
      expect(NlpUtil.getTokenizer('it')).toBeInstanceOf(Natural.AggressiveTokenizerIt); // italian
      expect(NlpUtil.getTokenizer('nl')).toBeInstanceOf(Natural.AggressiveTokenizerNl); // dutch
      expect(NlpUtil.getTokenizer('no')).toBeInstanceOf(Natural.AggressiveTokenizerNo); // norwegian
      expect(NlpUtil.getTokenizer('pt')).toBeInstanceOf(Natural.AggressiveTokenizerPt); // portuguese
      expect(NlpUtil.getTokenizer('pl')).toBeInstanceOf(Natural.AggressiveTokenizerPl); // polish
      expect(NlpUtil.getTokenizer('sv')).toBeInstanceOf(Natural.AggressiveTokenizerSv); // swedish
      expect(NlpUtil.getTokenizer('id')).toBeDefined(); // indonesian
      expect(NlpUtil.getTokenizer('ja')).toBeInstanceOf(Natural.TokenizerJa); // japanese
      expect(NlpUtil.getTokenizer('da')).toBeInstanceOf(Natural.TreebankWordTokenizer); // danish
      expect(NlpUtil.getTokenizer('fi')).toBeInstanceOf(Natural.TreebankWordTokenizer); // finnish
      expect(NlpUtil.getTokenizer('de')).toBeInstanceOf(Natural.TreebankWordTokenizer); // german
      expect(NlpUtil.getTokenizer('hu')).toBeInstanceOf(Natural.TreebankWordTokenizer); // hungarian
      expect(NlpUtil.getTokenizer('ro')).toBeInstanceOf(Natural.TreebankWordTokenizer); // romanian
      expect(NlpUtil.getTokenizer('tr')).toBeInstanceOf(Natural.TreebankWordTokenizer); // turkish
    });
    test('Shoul return an Treebank word Tokenizer for unknown locales', () => {
      expect(NlpUtil.getTokenizer('aa')).toBeInstanceOf(Natural.TreebankWordTokenizer);
      expect(NlpUtil.getTokenizer('')).toBeInstanceOf(Natural.TreebankWordTokenizer);
      expect(NlpUtil.getTokenizer()).toBeInstanceOf(Natural.TreebankWordTokenizer);
    });
  });
});
