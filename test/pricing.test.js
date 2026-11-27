var test = require('node:test');
var assert = require('node:assert/strict');
var pricing = require('../lib/pricing');

test('applies coupon discount before HSN GST and splits tax evenly', function () {
  var totals = pricing.computeTotals([
    { id: 'rice', name: 'Rice', hsn: '1006', price: 500, qty: 1 }
  ], ' save10 ');

  assert.equal(totals.subtotal, 500);
  assert.equal(totals.discount, 50);
  assert.equal(totals.taxable, 450);
  assert.equal(totals.tax, 22.5);
  assert.equal(totals.cgst, 11.25);
  assert.equal(totals.sgst, 11.25);
  assert.equal(totals.total, 472.5);
  assert.deepEqual(totals.lines[0], {
    id: 'rice',
    name: 'Rice',
    hsn: '1006',
    gstPercent: 5,
    gross: 500,
    discount: 50,
    taxable: 450,
    tax: 22.5,
    net: 472.5
  });
});
