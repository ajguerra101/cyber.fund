import winston from 'winston'
import extractFromPromise from '/imports/api/server/extractFromPromise'
import cfEs from '/imports/api/cfEs/server/cyberfund-es'
const xchangeCurrent = require("./collections").feedsCurrent;
const xchangeVwap = require("./collections").feedsVwapCurrent;
const feedUrl = 'http://kong.cyber.fund/xcm'


import {default as weightedPriceNative} from './weightedPriceNative'

xchangeCurrent._ensureIndex({
  market: 1, base: 1, quote: 1
}, {unique: true, dropDups: true});

xchangeVwap._ensureIndex({
  base: 1, quote: 1
}, {unique: true, dropDups: true});


function fetchDirect() {
  var res = HTTP.get(feedUrl, {
    timeout: 10000
  }, function(err, res) {
    if (err) winston.log('error', "Coukd not fetch", err, true)
    else {
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(function(it) {
          const _id = [it.quote, it.base, it.market].join('_')
          xchangeCurrent.upsert({
            _id: _id, market: it.market, quote: it.quote, base: it.base
          }, {$set: it})
        })
      }
    }
  });
}

const flatten = require("../elastic/traverseAggregations").flatten

const _fetchXchangeData = () => {
  const data = extractFromPromise(cfEs.sendQuery ("xchangeData"));
  if (data && data.aggregations)
    return flatten(data, ['by_quote', 'by_base', 'by_market', 'latest']);
  else
    return []
}

const _fetchXchangeVwapData = () => {
  const data = extractFromPromise(cfEs.sendQuery ("xchangeVwapData"));
  if (data && data.aggregations)
    return flatten(data, ['by_quote', 'by_base', 'latest']);
  else
    return []
}

function volumeBtc(point){
  return point.volume.native/weightedPriceNative(point.quote, "Bitcoin");
}

function priceBtc(point){
  return point.last.native / weightedPriceNative(point.base, "Bitcoin")
}

exports.fetchDirect = fetchDirect
exports.fetchXchangeData = () => {
  const ret = _fetchXchangeData();
  _.each(ret, function(item) {
    const it = _.omit(item._source, ['price', 'volume']);
    const _id = [it.quote, it.base, it.market].join('_')
    //TODO: handling depending on index version.
    // (can get version from form item._index,  )
    it.last = {native: item._source.price}
    it.volume = {native: item._source.volume}
    it.volume.btc = volumeBtc(it)
    it.last.btc = priceBtc(it);

    xchangeCurrent.upsert({
      _id: _id, market: it.market, quote: it.quote, base: it.base
    }, {$set: it})
  });
}

exports.fetchXchangeVwapData = () => {
  const ret = _fetchXchangeVwapData();
  _.each(ret, function(item) {
    const it = _.omit(item._source, ['price', 'volume_daily']);
    const _id = [it.quote, it.base].join('_')
    //TODO: handling depending on index version.
    it.last = {native: item._source.price}
    it.volume = {native: item._source.volume_daily}
    it.volume.btc = volumeBtc(it)
    it.last.btc = priceBtc(it);

    xchangeVwap.upsert({
      _id: _id, quote: it.quote, base: it.base
    }, {$set: it})
  });
}
