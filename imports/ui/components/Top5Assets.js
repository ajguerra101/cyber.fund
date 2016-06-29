import React, { PropTypes }from 'react'
import { Grid, Cell, Tooltip } from 'react-mdl'
import Image from '../components/Image'
import helpers from '../helpers'

const Top5Assets = (props) => {
	// render rows with data
  	function renderRows() {
		return props.systems.map( i => {
			return  <tr key={i._id}>
						<td className="mdl-data-table__cell--non-numeric">
							<a href={`/system/${helpers._toUnderscores(i._id)}`}>
								<Image
									avatar
									src={i}
									style={{marginRight: 24}}
									/>
								<span>{helpers.displaySystemName(i)}</span>
							</a>
						</td>
						<td>
							{helpers.readableN1(i.calculatable.RATING.vector.GR.monthlyGrowthD)}
						</td>
						<td>
							{helpers.readableN0(i.calculatable.RATING.vector.GR.months)}
						</td>
						<td>
							{helpers.readableN1(i.calculatable.RATING.sum)}
						</td>
					</tr>
		})
	}
    // TOOLTIPS TEXT
	// <br/> is the way MDL implements multiline tooltips
    const cmgrTP = <span>Key indicator that shows<br/> long term profitability of<br/> investment. We use monthly<br/> calculation in opposite to<br/> annual in traditional finance<br/> as blockchain markets are<br/> faster than tradational thus<br/> should be evaulated more<br/> frequently.</span>
	const monthsTP = <span>This is time passed since<br/> time of sampling 'first price'<br/> metric.</span>
	const ratingTP = <span>Compound evaluation of a<br/> given crypto property.<br/>Methodology depend on<br/> a stage, type and class<br/> of a given cryptoproperty.<br/>More than 50 indicators are<br/> evaluated in a realtime.</span>

    return (
      <div>
        <Grid>
          <Cell col={12}>
            <h5 className="center"> Top 5 Rated Assets </h5>
          </Cell>
        </Grid>
        <Grid>
			<Cell col={12}>
				<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp center" {...props}>
					<thead>
						<tr>
							<th style={{textAlign: 'center'}} className="mdl-data-table__cell--non-numeric">
							    System
							</th>
							<th>
								<Tooltip label={cmgrTP} large>
								    CMGR[$]
								</Tooltip>
							</th>
							<th>
								<Tooltip label={monthsTP} large>
								    Months
								</Tooltip>
							</th>
							<th>
								<Tooltip label={ratingTP} large>
								    Rating
								</Tooltip>
							</th>
						</tr>
					</thead>
					<tbody>
						{renderRows()}
					</tbody>
				</table>
			</Cell>
          {/* you can add components after table */}
          {props.children}
        </Grid>
      </div>
  )
}
Top5Assets.propTypes = {
  systems: PropTypes.array.isRequired
}
export default Top5Assets
