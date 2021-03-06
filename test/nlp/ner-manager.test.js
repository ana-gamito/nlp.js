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

const { SimilarSearch, NerManager } = require('../../lib');

describe('NER Manager', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const manager = new NerManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize properties', () => {
      const manager = new NerManager();
      expect(manager.threshold).toEqual(0.5);
      expect(manager.namedEntities).toBeDefined();
      expect(manager.similar).toBeInstanceOf(SimilarSearch);
    });
    test('Should initialize threshold if provided', () => {
      const manager = new NerManager({ threshold: 0.6 });
      expect(manager.threshold).toEqual(0.6);
    });
  });

  describe('Add named entity', () => {
    test('Should add a new named entity', () => {
      const manager = new NerManager();
      const entity = manager.addNamedEntity('entity1');
      expect(entity).toBeDefined();
      expect(entity).toEqual({ name: 'entity1', options: [] });
    });
    test('Should return the same entity if already exists', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const entity2 = manager.addNamedEntity('entity1');
      expect(entity1).toBe(entity2);
    });
    test('Should be able to add several entities', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const entity2 = manager.addNamedEntity('entity2');
      expect(entity1).toEqual({ name: 'entity1', options: [] });
      expect(entity2).toEqual({ name: 'entity2', options: [] });
    });
  });

  describe('Get named entity', () => {
    test('Should get existing entity', () => {
      const manager = new NerManager();
      const entity1 = manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity1');
      expect(result).toBe(entity1);
    });
    test('Should return undefined if entity does not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity2');
      expect(result).toBeUndefined();
    });
    test('Should create a new entity if forced and not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      const result = manager.getNamedEntity('entity2', true);
      expect(result).toEqual({ name: 'entity2', options: [] });
    });
  });

  describe('Remove named entity', () => {
    test('Should remove an existing entity', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.removeNamedEntity('entity1');
      const result = manager.getNamedEntity('entiy1');
      expect(result).toBeUndefined();
    });
    test('Should do nothing if entity does not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.removeNamedEntity('entity2');
      const result = manager.getNamedEntity('entity1');
      expect(result).toBeDefined();
    });
  });

  describe('Get Options Position From Entity', () => {
    const manager = new NerManager();
    const entity = manager.addNamedEntity('entity1');
    const option1 = { name: 'option1' };
    const option2 = { name: 'option2' };
    const option3 = { name: 'option3' };
    entity.options.push(option1);
    entity.options.push(option2);
    entity.options.push(option3);
    expect(manager.getOptionsPositionFromEntity(entity, 'option1')).toEqual(0);
    expect(manager.getOptionsPositionFromEntity(entity, 'option2')).toEqual(1);
    expect(manager.getOptionsPositionFromEntity(entity, 'option3')).toEqual(2);
    expect(manager.getOptionsPositionFromEntity(entity, 'option4')).toEqual(-1);
  });

  describe('Get Option From Entity', () => {
    const manager = new NerManager();
    const entity = manager.addNamedEntity('entity1');
    const option1 = { name: 'option1' };
    const option2 = { name: 'option2' };
    const option3 = { name: 'option3' };
    entity.options.push(option1);
    entity.options.push(option2);
    entity.options.push(option3);
    expect(manager.getOptionFromEntity(entity, 'option1')).toBe(option1);
    expect(manager.getOptionFromEntity(entity, 'option2')).toBe(option2);
    expect(manager.getOptionFromEntity(entity, 'option3')).toBe(option3);
    expect(manager.getOptionFromEntity(entity, 'option4')).toBeUndefined();
  });

  describe('Add named entity option', () => {
    test('Should add a new option to an existing entity', () => {
      const manager = new NerManager();
      const entity = manager.addNamedEntity('entity1');
      expect(entity.options).toHaveLength(0);
      manager.addNamedEntityOption('entity1', 'option1_1');
      expect(entity.options).toHaveLength(1);
    });
    test('Should add a the entity if not exist', () => {
      const manager = new NerManager();
      manager.addNamedEntityOption('entity1', 'option1_1');
      const entity = manager.getNamedEntity('entity1');
      expect(entity).toBeDefined();
      expect(entity.options).toHaveLength(1);
    });
    test('Should return the added option', () => {
      const manager = new NerManager();
      const option = manager.addNamedEntityOption('entity1', 'option1_1');
      expect(option).toBeDefined();
      expect(option.name).toEqual('option1_1');
      expect(option.texts).toEqual({});
    });
  });

  describe('Remove named entity option', () => {
    test('Should remove an option from an entity', () => {
      const manager = new NerManager();
      const entity = manager.addNamedEntity('entity1');
      manager.addNamedEntityOption('entity1', 'option1_1');
      manager.addNamedEntityOption('entity1', 'option1_2');
      let result = manager.getOptionFromEntity(entity, 'option1_2');
      expect(result).toBeDefined();
      result = manager.removeNamedEntityOption('entity1', 'option1_2');
      result = manager.getOptionFromEntity(entity, 'option1_2');
      expect(result).toBeUndefined();
    });
  });

  describe('Get named entity option', () => {
    test('Should return the option from the entity', () => {
      const manager = new NerManager();
      const option = manager.addNamedEntityOption('entity1', 'option1_1');
      const result = manager.getNamedEntityOption('entity1', 'option1_1');
      expect(result).toBe(option);
    });
    test('Should result undefined if option not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntityOption('entity1', 'option1_1');
      const result = manager.getNamedEntityOption('entity1', 'option1_2');
      expect(result).toBeUndefined();
    });
    test('Should result undefined if entity not exists', () => {
      const manager = new NerManager();
      manager.addNamedEntityOption('entity1', 'option1_1');
      const result = manager.getNamedEntityOption('entity2', 'option1_2');
      expect(result).toBeUndefined();
    });
    test('Should create option if not exists and forced', () => {
      const manager = new NerManager();
      manager.addNamedEntityOption('entity1', 'option1_1');
      const result = manager.getNamedEntityOption('entity1', 'option1_2', true);
      expect(result).toBeDefined();
    });
    test('Should create entity if not exists and forced', () => {
      const manager = new NerManager();
      const result = manager.getNamedEntityOption('entity1', 'option1_2', true);
      expect(result).toBeDefined();
    });
  });

  describe('Add named entity texst', () => {
    test('Should add text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', 'en', 'Something');
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en[0]).toEqual('Something');
    });
    test('Should add several text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', 'en', ['Something', 'Anything']);
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en[0]).toEqual('Something');
      expect(option.texts.en[1]).toEqual('Anything');
    });
    test('Should add several text for several languages', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', ['en', 'es'], ['Something', 'Anything']);
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en[0]).toEqual('Something');
      expect(option.texts.en[1]).toEqual('Anything');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es[0]).toEqual('Something');
      expect(option.texts.es[1]).toEqual('Anything');
    });
  });

  describe('Remove named entity texst', () => {
    test('Should remove text for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', ['en', 'es'], ['Something', 'Anything']);
      manager.removeNamedEntityText('entity1', 'option1', 'es', 'Something');
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en).toHaveLength(2);
      expect(option.texts.en[0]).toEqual('Something');
      expect(option.texts.en[1]).toEqual('Anything');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es).toHaveLength(1);
      expect(option.texts.es[0]).toEqual('Anything');
    });
    test('Should remove texts for a given language', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', ['en', 'es'], ['Something', 'Anything']);
      manager.removeNamedEntityText('entity1', 'option1', 'es', ['Something', 'Anything']);
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en[0]).toEqual('Something');
      expect(option.texts.en[1]).toEqual('Anything');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es).toHaveLength(0);
    });
    test('Should remove text for several languages', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('entity1', 'option1', ['en', 'es'], ['Something', 'Anything']);
      manager.removeNamedEntityText('entity1', 'option1', ['en', 'es'], 'Something');
      const option = manager.getNamedEntityOption('entity1', 'option1');
      expect(option).toBeDefined();
      expect(option.texts).toBeDefined();
      expect(option.texts.en).toBeDefined();
      expect(option.texts.en[0]).toEqual('Anything');
      expect(option.texts.es).toBeDefined();
      expect(option.texts.es[0]).toEqual('Anything');
    });
  });

  describe('Get entities from utterance', () => {
    test('Should find template entities inside utterance', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.addNamedEntity('entity2');
      manager.addNamedEntity('entity3');
      const entities = manager.getEntitiesFromUtterance('This is %entity1% from %entity3% yeah');
      expect(entities).toEqual(['entity1', 'entity3']);
    });
    test('If some template is not entity should not be included', () => {
      const manager = new NerManager();
      manager.addNamedEntity('entity1');
      manager.addNamedEntity('entity2');
      manager.addNamedEntity('entity3');
      const entities = manager.getEntitiesFromUtterance('This is %entity1% with %entity4% from %entity3% yeah');
      expect(entities).toEqual(['entity1', 'entity3']);
    });
  });

  describe('Find entities', () => {
    test('Should find an entity inside an utterance', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
      manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = manager.findEntities('I saw spiderman in the city', 'en');
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(6);
      expect(entities[0].end).toEqual(15);
      expect(entities[0].levenshtein).toEqual(0);
      expect(entities[0].accuracy).toEqual(1);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spiderman');
    });
    test('Should find an entity if levenshtein greater than threshold', () => {
      const manager = new NerManager({ threshold: 0.8 });
      manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
      manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = manager.findEntities('I saw spederman in the city', 'en');
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(1);
      expect(entities[0].start).toEqual(6);
      expect(entities[0].end).toEqual(15);
      expect(entities[0].levenshtein).toEqual(1);
      expect(entities[0].accuracy).toEqual(0.8888888888888888);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spederman');
    });
    test('Should not find an entity if levenshtein less than threshold', () => {
      const manager = new NerManager({ threshold: 0.8 });
      manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
      manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      const entities = manager.findEntities('I saw spererman in the city', 'en');
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(0);
    });
    test('Should find several entities inside an utterance', () => {
      const manager = new NerManager();
      manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spiderman', 'Spider-man']);
      manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man', 'iron-man']);
      manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
      manager.addNamedEntityText('food', 'burguer', ['en'], ['Burguer', 'Hamburguer']);
      manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
      manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
      const entities = manager.findEntities('I saw spiderman eating spaghetti in the city', 'en');
      expect(entities).toBeDefined();
      expect(entities).toHaveLength(2);
      expect(entities[0].option).toEqual('spiderman');
      expect(entities[0].sourceText).toEqual('Spiderman');
      expect(entities[0].entity).toEqual('hero');
      expect(entities[0].utteranceText).toEqual('spiderman');
      expect(entities[1].option).toEqual('pasta');
      expect(entities[1].sourceText).toEqual('spaghetti');
      expect(entities[1].entity).toEqual('food');
      expect(entities[1].utteranceText).toEqual('spaghetti');
    });
  });
});
