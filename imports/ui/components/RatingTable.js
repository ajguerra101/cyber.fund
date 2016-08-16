import React, { PropTypes }from 'react'
import { Grid, Cell } from 'react-mdl'
import get from 'oget'
import helpers from '../helpers'
import { If, Show } from '../components/Utils'
import SystemLink from '../components/SystemLink'
import Rating from '../components/Rating'
import RatingTableHead from '../components/RatingTableHead'
import PageLoading from '../higherOrderComponents/PageLoading'

// renders big table with all systems with high rating
// usage example:
// <RatingTable systems={Array} />


/*Template["ratingTable"].events({
    "click .show-more": function(e, t) {
      var step = CF.Rating.step;
      var limit = Session.get("ratingPageLimit");
      limit += step;
      analytics.track("Viewed Crap", {
        counter: (limit - initialLimit) / step
      });
      limit = Math.min(limit, Counts.get("coinsCount"));
      Session.set("ratingPageLimit", limit);
    },
    "click .no-click a": function() {
      return false;
    }
*/
// TODO Check blaze code of this component for analytics event and what ever

class RatingTable extends React.Component {

	render() {

		const 	{ props, state } = this,
				{ inflationToText, dailyTradeVolumeToText } = helpers,
				nonNumeric = "mdl-data-table__cell--non-numeric"

		console.warn(CF.Rating.getSorterByKey())
		console.warn(props.systems.length)

	    function renderRows() {
			return props.systems.map( (system, index) => {
				const { metrics, _usersStarred, calculatable } = system
				console.warn(system)
				// FIXME check blaze's component html for seo props
				// NOTE currently this checks are unfinished
                return  <tr key={system._id} itemScope itemType="http://schema.org/Product">
							<td> {index} </td>
                            <td className={nonNumeric}>
								<SystemLink system={system} />
                            </td>
							<td className={nonNumeric}>
				  		        <span>
									{inflationToText(metrics.supplyChangePercents.month)}
				  		          {/* {{#if eq ../../_period "month"}}
				  		            {{inflationToText metrics.supplyChangePercents.month}}
				  		          {{else}}
				  		            {{inflationToText metrics.supplyChangePercents.day}}
				  		          {{/if}} */}
				  		        </span>
					       	</td>
						   	<td className={nonNumeric}>
								{/* FIXME do we need this span? */}
								<span>
									{
										metrics.tradeVolume >= 0.2
										? 	dailyTradeVolumeToText(
												metrics.tradeVolume,
												metrics.cap.btc,
												false
											)
										: 	'Illiquid'
									}
						        </span>
        					</td>
						   	<td className={nonNumeric}>
								{/* {{#if tradeVolumeOk metrics.tradeVolume}}
							   		{{#withTooltip ttName="tradeTooltip" data=this  _period=../../_period}}
								   		<span>{{dailyTradeVolumeToText metrics.tradeVolume metrics.cap.btc false}}</span>
								   	{{/withTooltip}}
								{{else}}
							   		<span>{{#withTooltip}} Illiquid {{/withTooltip}}</span>
							   {{/if}} */}
					        </td>
							<td>
								{ helpers.readableN1(get(calculatable, 'RATING.vector.GR.monthlyGrowthD')) + '%' }
							</td>
							<td>
								{ helpers.readableN0(get(calculatable, 'RATING.vector.GR.months')) }
							</td>
							{/* FIXME do we need this span? */}
							<td>QUICKCHART</td>
							{/* <td class="right-align">{{#withTooltip}}
						      {{#if eq ../../_period "month"}}
						        {{#if metrics.capChangePercents.month.usd}}
						          <span class="{{greenRedNumber metrics.capChangePercents.month.usd}}">
						          {{percentsToTextUpDown metrics.capChangePercents.month.usd 2}}</span>
						        {{/if}}
						      {{else}}
						        {{#if metrics.capChangePercents.day.usd}}
						          <span class="{{greenRedNumber metrics.capChangePercents.day.usd}}">
						          {{percentsToTextUpDown metrics.capChangePercents.day.usd 2}}</span>
						        {{/if}}
						      {{/if}}
						      {{#tooltip}}
						      <div>Real change:
						        <b>
						          {{#if eq ../../_period "month"}}
						            {{readableN2 metrics.capChange.month.usd}} $
						          {{else}}
						            {{readableN2 metrics.capChange.day.usd}} $
						          {{/if}}
						        </b>
						      </div>
						      {{/tooltip}} {{/withTooltip}}
						    </td> */}
							<td>
								<span className="text-large">
									$&nbsp;{helpers.readableN0(metrics.cap.usd)}
								</span>
							</td>
							<td> {_usersStarred.length} </td>
							<td>
								<Rating value={system.calculatable.RATING.sum} />
							</td>
                        </tr>
	    })}

	    return 	<div>
					<Cell col={12}>
			  			<a href="/monthly/rating"> Switch to monthly view </a>
					</Cell>
					<If condition={props.loaded}>
						<Cell col={12} className="table-overflow" {...props}>
							<RatingTableHead />
							{/* FIXME do we need id and styles? */}
							<table
								id="rating-table"
								style={{width: '100%'}}
								className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center"
							>
								<thead>
									<tr>
										<th>Rank</th>
										<th className={nonNumeric}>System</th>
										<th>Token</th>
										<th>Trade</th>
										<th>CMGR[$]</th>
										<th>Months</th>
										<th>Cap in $</th>
										<th>Price</th>
										<th>1d Change</th>
										<th>Stars</th>
										<th>Rating</th>
									</tr>
								</thead>
								<tbody>
									{renderRows()}
								</tbody>
				            </table>

							{/* FIXME refactor this? */}
							{/* TODO don't forget to implement 'hasMore' prop */}
							<If condition={props.hasMore}>
							    <p className="center">
							        We filter illiquid assets and assets with <a href="https://www.academia.edu/22691395/cyber_Rating_Crypto_Property_Evaluation" target="_blank">cyber • Rating</a> less than 1
							    </p>
							    <div className="center">
							        <br />
							        <a className="waves-effect waves-light btn show-more deep-orange" href="/tracking">
							      View all opportunities
							    </a>
							    </div>
							</If>
						</Cell>
					</If>
				</div>
	}
}

RatingTable.propTypes = {
  systems: PropTypes.array.isRequired
}

export default PageLoading(RatingTable)