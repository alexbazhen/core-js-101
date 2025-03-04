/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(/* proto, json */) {
  throw new Error('Not implemented');
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyElement {
  constructor(value, type, parent) {
    this.type = type;
    this.value = value;
    this.sym = '';
    this.end = '';
    if (this.type === 'elem') this.sym = '';
    if (this.type === 'id') this.sym = '#';
    if (this.type === 'class') this.sym = '.';
    if (this.type === 'attr') {
      this.sym = '[';
      this.end = ']';
    }
    if (this.type === 'pseudoClass') this.sym = ':';
    if (this.type === 'pseudoElement') this.sym = '::';
    this.child = {};
    this.parent = parent;
    this.validError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.partsError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element() {
    if (this.type === 'elem') throw new Error(this.validError);
    if (this.type !== 'elem') throw new Error(this.partsError);
    return this.type;
  }

  id(val) {
    if (this.type === 'id') throw new Error(this.validError);
    if (this.type !== 'elem') throw new Error(this.partsError);
    this.child = new MyElement(val, 'id', this);
    return this.child;
  }

  class(val) {
    if (this.type === 'attr' || this.type === 'pseudoClass' || this.type === 'pseudoElement') throw new Error(this.partsError);
    this.child = new MyElement(val, 'class', this);
    return this.child;
  }

  attr(val) {
    if (this.type === 'pseudoClass' || this.type === 'pseudoElement') throw new Error(this.partsError);
    this.child = new MyElement(val, 'attr', this);
    return this.child;
  }

  pseudoClass(val) {
    if (this.type === 'pseudoElement') throw new Error(this.partsError);
    this.child = new MyElement(val, 'pseudoClass', this);
    return this.child;
  }

  pseudoElement(val) {
    if (this.type === 'pseudoElement') throw new Error(this.validError);
    this.child = new MyElement(val, 'pseudoElement', this);
    return this.child;
  }

  stringify() {
    const par = this.parent ? this.parent.stringify() : '';
    return `${par}${this.sym}${this.value}${this.end}`;
  }
}

const cssSelectorBuilder = {
  element: (value) => new MyElement(value, 'elem'),

  id: (value) => new MyElement(value, 'id'),

  class: (value) => new MyElement(value, 'class'),

  attr: (value) => new MyElement(value, 'attr'),

  pseudoClass: (value) => new MyElement(value, 'pseudoClass'),

  pseudoElement: (value) => new MyElement(value, 'pseudoElement'),

  combine: (selector1, combinator, selector2) => ({
    stringify: () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
  }),

  stringify: () => `${this.element.stringify()}`,
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
