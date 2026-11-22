var test = require('node:test');
var assert = require('node:assert/strict');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function pickTotals(value) {
  return {
    subtotal: value.subtotal,
    discount: value.discount,
    tax: value.tax,
    cgst: value.cgst,
    sgst: value.sgst,
    total: value.total
  };
}

test('CURRENT BEHAVIOUR: #1001-style 5% and 12% lines use explicit gstRate on the invoice', function () {
  var items = [
    { id: 1, name: 'Rice', price: 640, qty: 1, hsn: '1006', gstRate: 5 },
    { id: 6, name: 'Ghee', price: 450, qty: 1, hsn: '0405', gstRate: 12 }
  ];
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: '' });
  var checkout = pricing.computeTotals(items, '');

  assert.deepStrictEqual(pickTotals(figures), {
    subtotal: 1090, discount: 0, tax: 86, cgst: 43, sgst: 43, total: 1176
  });
  assert.deepStrictEqual(pickTotals(checkout), {
    subtotal: 1090, discount: 0, tax: 86, cgst: 43, sgst: 43, total: 1176
  });
  assert.deepStrictEqual(figures.rows.map(function (row) { return row.gstPercent; }), [5, 12]);
});

test('CURRENT BEHAVIOUR: #1002-style SAVE10 invoice matches checkout totals', function () {
  var items = [
    { id: 1, name: 'Rice', price: 640, qty: 1, hsn: '1006', gstRate: 5 },
    { id: 4, name: 'Sunflower Oil', price: 190, qty: 2, hsn: '1512', gstRate: 5 }
  ];
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });
  var checkout = pricing.computeTotals(items, 'SAVE10');

  assert.deepStrictEqual(pickTotals(figures), {
    subtotal: 1020, discount: 102, tax: 45.9, cgst: 22.95, sgst: 22.95, total: 963.9
  });
  assert.deepStrictEqual(pickTotals(checkout), {
    subtotal: 1020, discount: 102, tax: 45.9, cgst: 22.95, sgst: 22.95, total: 963.9
  });
});

test('CURRENT BEHAVIOUR: #1004-style SAVE10 invoice honors the ₹150 discount cap', function () {
  var items = [
    { id: 5, name: 'Groundnut Oil', price: 1120, qty: 2, hsn: '1508', gstRate: 5 }
  ];
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });
  var checkout = pricing.computeTotals(items, 'SAVE10');

  assert.deepStrictEqual(pickTotals(figures), {
    subtotal: 2240, discount: 150, tax: 104.5, cgst: 52.25, sgst: 52.25, total: 2194.5
  });
  assert.deepStrictEqual(pickTotals(checkout), {
    subtotal: 2240, discount: 150, tax: 104.5, cgst: 52.25, sgst: 52.25, total: 2194.5
  });
});

test('CURRENT BEHAVIOUR: #1008-style 18% lines produce matching invoice and checkout figures', function () {
  var items = [
    { id: 8, name: 'Tea', price: 140, qty: 1, hsn: '0902', gstRate: 18 },
    { id: 12, name: 'Kokum Sherbet', price: 180, qty: 2, hsn: '2106', gstRate: 18 }
  ];
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: '' });
  var checkout = pricing.computeTotals(items, '');

  assert.deepStrictEqual(pickTotals(figures), {
    subtotal: 500, discount: 0, tax: 90, cgst: 45, sgst: 45, total: 590
  });
  assert.deepStrictEqual(pickTotals(checkout), {
    subtotal: 500, discount: 0, tax: 90, cgst: 45, sgst: 45, total: 590
  });
});

test('invoice matches checkout for HSN GST and capped coupon discounts', function () {
  var items = [
    { id: 5, name: 'Groundnut Oil', price: 1120, qty: 2, hsn: '1508' }
  ];
  var figures = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });
  var checkout = pricing.computeTotals(items, 'SAVE10');

  assert.deepStrictEqual(pickTotals(figures), pickTotals(checkout));
  assert.deepStrictEqual(figures.rows.map(function (row) { return row.gstPercent; }), [5]);
});
