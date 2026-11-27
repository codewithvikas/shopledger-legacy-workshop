var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

test('invoice uses the same HSN GST slab as order pricing', function () {
  var items = [
    { id: 'rice', name: 'Rice', hsn: '1006', price: 500, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, '');
  var order = { id: 1001, items: items, total: billed.total };
  var figures = invoice.computeInvoiceFigures(order);

  assert.equal(billed.tax, 25);
  assert.equal(billed.total, 525);
  assert.equal(figures.rows[0].gstPercent, 5);
  assert.equal(figures.tax, billed.tax);
  assert.equal(figures.total, billed.total);
});

test('invoice applies the same capped coupon discount as order pricing', function () {
  var items = [
    { id: 'rice', name: 'Rice', hsn: '1006', price: 3000, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, 'SAVE10');
  var order = { id: 1002, items: items, coupon: 'SAVE10', total: billed.total };
  var figures = invoice.computeInvoiceFigures(order);

  assert.equal(billed.discount, 150);
  assert.equal(billed.total, 2992.5);
  assert.equal(figures.discount, billed.discount);
  assert.equal(figures.total, billed.total);
});

test('rendered invoice agrees with the order ledger total without a reconciliation warning', function () {
  var items = [
    { id: 'rice', name: 'Rice', hsn: '1006', price: 500, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, '');
  var html = invoice.render({ id: 1003, items: items, total: billed.total });

  assert.match(html, /Invoice Total<\/td><td class="r">₹525\.00/);
  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
});

