import cfCDs from '/imports/api/currentData/selectors'
import {CurrentData} from '/imports/api/collections'
import quantumCheck from '/imports/api/cf/accounts/quantumCheck'
// recalculate raised amount crutch

function updateCrowdsales() {
  var activeCrowdsales = CurrentData.find({
    $and: [cfCDs.crowdsales(), {
      'crowdsales.end_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $lt: new Date()
      }
    }]
  }, {
    fields: {
      'crowdsales': 1,
      'system': 1
    }
  }).fetch();
  var length = activeCrowdsales.length;
  var current = 0;
  var interval = Meteor.setInterval(function() {
    if (current < length) {
      var crowdsale = activeCrowdsales[current];
      if (crowdsale.crowdsales) {
        var addr = crowdsale.crowdsales.genesis_address;

        if (addr) {
          if (_.isString(addr)) {
            addr = [addr];
          }
          if (_.isArray(addr)) {
            var raised = {};
            _.each(addr, function(address) {
              if (!address) return;
              var balances = quantumCheck(address);
               //TODO: use imports here.
              if (!balances || balances[0] == 'error') {
                console.log(`error`)
                console.log(`address + quantumCheck(${address})`)
                console.log("results in ")
                console.log(balances)
                return;
              }
              _.each(balances, function(b) {
                if (b.quantity && b.asset) {
                  var val = typeof b.quantity == 'number' ? b.quantity : parseFloat(b.quantity);
                  if (_.has(raised, b.asset)) raised[b.asset] += val;
                  else raised[b.asset] = val;
                }
              })
            });
            var sum = 0;
            var date = new Date();
            _.each(raised, function(v, k) {
              var sys = CurrentData.findOne({
                _id: k
              });
              if (sys && sys.metrics && sys.metrics.price && sys.metrics.price.btc) {
                sum += sys.metrics.price.btc * v;
              } else console.log("could not calculate crowdsale correctly, coin ", k, " has no btc price.");
            })
            if (sum) {
          //    print("crowdsale", crowdsale._id, true);
              // print("raised", raised, true);
              // print("sum", sum);
              CurrentData.update({
                _id: crowdsale._id
              }, {
                $set: {
                  'metrics.currently_raised': sum,
                  'metrics.currently_raised_full': raised,
                  'metrics.currently_raised_updatedAt': date
                }
              })
            }
          }
        }
      }
      ++current;
    } else {
      Meteor.clearInterval(interval);
    }
  }, 120 * 1000); // 120 seconds per query
}

if (Meteor.settings.qcCrowdsales) SyncedCron.add({
  name: 'update active crowdsales',
  schedule: function(parser) {
    // parser is a later.parse object
   return parser.cron("8/10 * * * *", false);
  },
  job: function() {
    updateCrowdsales()
  }
});
