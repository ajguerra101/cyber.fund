import {CurrentData} from '/imports/api/collections'
import cfCDs from '/imports/api/currentData/selectors'
import uaGraph from '/imports/api/cf/userAssets/graph'
import {getPrice} from '/imports/api/currentData'
function jqHide(jQ) {
  if (jQ && jQ.addClass && typeof jQ.addClass == "function") {
    jQ.addClass("hidden");
  //  jQ.attr("visibility", "hidden");
    return jQ;
  }
};

function jqShow(jQ) {
  if (jQ && jQ.removeClass && typeof jQ.removeClass == "function") {
    jQ.removeClass("hidden");
    jQ.attr("visibility", "inherit");
    return jQ;
  }
};

Template["folioChart"].onRendered(function() {
  console.log('meow meow')
  /*
  var instance = this;
  instance._selector = ".folio-pie";
  instance.options = {
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    labelOffset: -10,
    labelDirection: "explode",
    fullWidth: true,
    donut: true,
    donutWidth: 80,
    plugins: [
      Chartist.plugins.tooltip()
    ]
  };

  var emptyData = {
    labels: [],
    series: []
  };

  // does not expect null/undef values before non-null/non-undef
  instance.chart = function(selector, data) {
    if (selector && data) {
      //if (instance.folioPie && instance.folioPie.update) {
        //instance.folioPie.update(data);
      //} else
      instance.folioPie = new Chartist.Pie(selector, data, instance.options);
      //return instance.folioPie;
    }

    if (!data) {
      if (instance.folioPie && instance.folioPie.update)
        instance.folioPie.update(emptyData);
    }
    return instance.folioPie;
  };

  instance.hideView = function() {
    var ret = instance.chart();
    jqHide(instance.$(".folio-pie"));
  };

  instance.showView = function(data) {
    jqShow(instance.$(".folio-pie"));
    instance.chart(instance._selector, data);
  };

  instance.autorun(function(comp) {
    var assets = Template.currentData() && Template.currentData().accountsData || {};

    if (_.isEmpty(assets)) {
      instance.hideView();
    }

    var ticks = [],
      labels = [];

    systems = _.keys(assets);
    var r = CurrentData.find(cfCDs.system(systems));

    var data = r.fetch().sort(function(x, y) {
      var q1 = accounts[x._id] && accounts[x._id].quantity || 0,
        q2 = accounts[y._id] && accounts[y._id].quantity || 0;
      return Math.sign(q2 * getPrice(y) - q1 * getPrice(x)) || Math.sign(q2 - q1);
    });

    var sum = 0; // this to be used o determine if minor actives
    var datum = []; // let s calculate first and put calculations here
    var others = { // here be minor actives
      symbol: "other",
      u: 0,
      b: 0,
      q: 0
    };

    _.each(data, function(system) {
      var asset = assets[system._id] || {};
      var point = {
        symbol: system.aliases && system.aliases.nickname || system._id,
        q: asset.quantity || 0,
        u: asset.vUsd || 0,
        b: asset.vBtc || 0
      };

      datum.push(point);
      sum += point.b;
    });

    if (!sum) {
      instance.hideView();
    }

    // push smalls into 'others'
    _.each(datum, function(point) {
      if (point.b / sum >= uaGraph.minimalShare) {
        labels.push(point.symbol);
        ticks.push({
          value: point.u,
          meta: "N: " + point.q.toFixed(4) + "; BTC: " + point.b.toFixed(4) + "; USD: " + point.u.toFixed(2)
        });
      } else {
        others.u += point.u;
        others.b += point.b;
      }
    });

    // if others, draw them too
    if (others.b && others.b > 0) {
      labels.push("Others");
      ticks.push({
        value: others.u,
        meta: "other assets: BTC: " + others.b.toFixed(4) + "; USD: " + others.u.toFixed(2)
      });
    }

    // final data check
    if (ticks.length > 1) {
      instance.showView({
        labels: labels,
        series: ticks
      });
    } else {
      instance.hideView();
    }
  });
  */
});
