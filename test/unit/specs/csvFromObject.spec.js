import _ from 'lodash';
import csv from 'src/lib/csvFromObject';

describe('csvFromObject.js', () => {
  const testStrEmpty = '';
  const testObjEmpty = {};
  const testArrEmpty = [];
  const testArrBasic = [
    {
      id: 248,
      animal: 'fox',
    }, {
      id: 369,
      animal: 'monkey',
    },
  ];
  const testArrSparse = [
    {
      id: 1,
    }, {
      id: 2,
      animal: 'monkey',
    }, {
      animal: 'frog',
    },
  ];
  const testArrNested = [
    {
      data: {
        num: 5,
      },
    }, {
      data: {
        num: 10,
      },
    },
  ];

  const defaultOpts = {
    includeHeader: true,
    fieldDelim: ',',
    nestedDelim: '.',
    emptyValue: null,
  };

  describe('canConvert()', () => {
    it('should return false if data is string', () => {
      expect(csv.canConvert(testStrEmpty)).to.equal(false);
    });
    it('should return true if data is object or array', () => {
      expect(csv.canConvert(testObjEmpty)).to.equal(true);
      expect(csv.canConvert(testArrEmpty)).to.equal(true);
    });
  });

  describe('toArray()', () => {
    it('should wrap object as an array', () => {
      expect(csv.toArray(testObjEmpty) instanceof Array).to.equal(true);
    });
    it('should leave arrays as is', () => {
      expect(csv.toArray(testArrEmpty) === testArrEmpty).to.equal(true);
    });
  });

  describe('generateFlattenedKey()', () => {
    it('should return root.leaf', () => {
      expect(csv.generateFlattenedKey('leaf', ['root'], '.') === 'root.leaf').to.equal(true);
    });
    it('should return root.sub.leaf', () => {
      expect(csv.generateFlattenedKey('leaf', ['root', 'sub'], '.') === 'root.sub.leaf').to.equal(true);
    });
  });

  describe('generateDereferenceOp()', () => {
    it('should return a function to dereference id, value === 248', () => {
      const op = csv.generateDereferenceOp('id', [], defaultOpts);
      expect(op(testArrBasic[0])).to.equal(248);
    });
    it('should return a function to dereference id, value === null', () => {
      const op = csv.generateDereferenceOp('id', [], defaultOpts);
      expect(op(testArrSparse[2])).to.equal(null);
    });
    it('should return a function to dereference data.num, value === 10', () => {
      const op = csv.generateDereferenceOp('num', ['data'], defaultOpts);
      expect(op(testArrNested[1])).to.equal(10);
    });
  });

  describe('getCsvMeta()', () => {
    it('should return empty array on empty array', () => {
      expect(_.isEqual(csv.getCsvMeta(testArrEmpty, defaultOpts).fields, [])).to.equal(true);
    });
    it('should extract id, animal as fields from basic array', () => {
      expect(_.isEqual(csv.getCsvMeta(testArrBasic, defaultOpts).fields, ['id', 'animal'])).to.equal(true);
    });
    it('should extract id, animal as fields from sparse array', () => {
      expect(_.isEqual(csv.getCsvMeta(testArrSparse, defaultOpts).fields, ['id', 'animal'])).to.equal(true);
    });
    it('should extract data.num as fields from nested array', () => {
      expect(_.isEqual(csv.getCsvMeta(testArrNested, defaultOpts).fields, ['data.num'])).to.equal(true);
    });
  });

  // describe('csvFromObject()', () => {
  //   // TODO
  // });
});

