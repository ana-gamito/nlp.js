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

const { LogisticRegressionClassifier } = require('../../lib');

function getClassifier2() {
  const classifier = new LogisticRegressionClassifier({});
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 0, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([0, 0, 0, 1, 1, 1], 'two');
  classifier.addObservation([0, 0, 0, 1, 0, 1], 'two');
  classifier.addObservation([0, 0, 0, 1, 1, 0], 'two');
  return classifier;
}

function addObservations3a(classifier) {
  classifier.addObservation([1, 1, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([1, 0, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([0, 0, 0, 1, 1, 1, 0, 0, 0], 'two');
  classifier.addObservation([0, 0, 0, 1, 0, 1, 0, 0, 0], 'two');
  classifier.addObservation([0, 0, 0, 1, 1, 0, 0, 0, 0], 'two');
}

function addObservations3b(classifier) {
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 1], 'three');
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 0, 1], 'three');
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 0], 'three');
}

function getClassifier3() {
  const classifier = new LogisticRegressionClassifier({});
  addObservations3a(classifier);
  addObservations3b(classifier);
  return classifier;
}

describe('Logistic Regression Classifier', () => {
  describe('Train', () => {
    test('Should create the theta', () => {
      const classifier = getClassifier2();
      expect(classifier.theta).toBeUndefined();
      classifier.train();
      expect(classifier.theta).toBeDefined();
      const expected = [[2.435654002632326, 1.272611182442263, 2.435654002632326,
        -2.7589918339683037, -1.6638497817221314, -1.6638497817221314],
      [-2.4356540026323272, -1.2726111824422628, -2.4356540026323272,
        2.758991833968306, 1.6638497817221316, 1.6638497817221316]];
      expect(classifier.theta).toHaveLength(expected.length);
      for (let i = 0, l = expected.length; i < l; i += 1) {
        expect(classifier.theta[i].elements).toEqual(expected[i]);
      }
    });
  });

  describe('Get classifications', () => {
    test('Should get correct clasifications for basic examples', () => {
      const classifier = getClassifier2();
      classifier.train();
      const classifications1 = classifier.getClassifications([0, 1, 1, 0, 0, 0]);
      expect(classifications1).toHaveLength(2);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.95);
      expect(classifications1[1].label).toEqual('two');
      expect(classifications1[1].value).toBeLessThan(0.05);
      const classifications2 = classifier.getClassifications([0, 0, 0, 0, 1, 1]);
      expect(classifications2).toHaveLength(2);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.95);
      expect(classifications2[1].label).toEqual('one');
      expect(classifications2[1].value).toBeLessThan(0.05);
    });
    test('Should get correct clasifications for more complex examples', () => {
      const classifier = getClassifier3();
      classifier.train();
      const classifications1 = classifier.getClassifications([1, 1, 0, 0, 0, 0, 1, 0, 0]);
      expect(classifications1).toHaveLength(3);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      const classifications2 = classifier.getClassifications([0, 0, 1, 1, 1, 0, 0, 0, 1]);
      expect(classifications2).toHaveLength(3);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      const classifications3 = classifier.getClassifications([1, 0, 0, 0, 1, 0, 0, 1, 1]);
      expect(classifications3).toHaveLength(3);
      expect(classifications3[0].label).toEqual('three');
      expect(classifications3[0].value).toBeGreaterThan(0.60);
    });
    test('Should allow retraining', () => {
      const classifier = new LogisticRegressionClassifier();
      addObservations3a(classifier);
      classifier.train();
      let classifications1 = classifier.getClassifications([1, 1, 0, 0, 0, 0, 1, 0, 0]);
      expect(classifications1).toHaveLength(2);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      let classifications2 = classifier.getClassifications([0, 0, 1, 1, 1, 0, 0, 0, 1]);
      expect(classifications2).toHaveLength(2);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      addObservations3b(classifier);
      classifier.train();
      classifications1 = classifier.getClassifications([1, 1, 0, 0, 0, 0, 1, 0, 0]);
      expect(classifications1).toHaveLength(3);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      classifications2 = classifier.getClassifications([0, 0, 1, 1, 1, 0, 0, 0, 1]);
      expect(classifications2).toHaveLength(3);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      const classifications3 = classifier.getClassifications([1, 0, 0, 0, 1, 0, 0, 1, 1]);
      expect(classifications3).toHaveLength(3);
      expect(classifications3[0].label).toEqual('three');
      expect(classifications3[0].value).toBeGreaterThan(0.60);
    });
  });

  describe('Get Best Classification', () => {
    test('Should get the best classification', () => {
      const classifier = getClassifier3();
      classifier.train();
      const classification1 = classifier.getBestClassification([1, 1, 0, 0, 0, 0, 1, 0, 0]);
      expect(classification1.label).toEqual('one');
      expect(classification1.value).toBeGreaterThan(0.85);
      const classification2 = classifier.getBestClassification([0, 0, 1, 1, 1, 0, 0, 0, 1]);
      expect(classification2.label).toEqual('two');
      expect(classification2.value).toBeGreaterThan(0.85);
      const classification3 = classifier.getBestClassification([1, 0, 0, 0, 1, 0, 0, 1, 1]);
      expect(classification3.label).toEqual('three');
      expect(classification3.value).toBeGreaterThan(0.60);
    });
    test('If cannot get classifications, then return undefined', () => {
      const classifier = new LogisticRegressionClassifier({});
      classifier.train();
      const classification = classifier.getBestClassification([1, 1, 0, 0, 0, 0, 1, 0, 0]);
      expect(classification).toBeUndefined();
    });
  });
});
