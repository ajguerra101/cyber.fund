import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Header, Navigation, Button } from 'react-mdl'
import BitcoinPrice from '../../components/BitcoinPrice'
import Search from '../../components/Search'
import ProfileLink from '../../components/ProfileLink'

class HeaderNav extends React.Component {

	render() {

		const 	user = Meteor.user()

		return	<Header
					scroll
					// HOME BUTTON
					title={
						<Button href="/" style={{color: 'white'}} ripple> Cyber.Fund </Button>
					}
				>
					{/* LINKS */}
					<Navigation>
						<a href=""> <Search color={{ color: 'inherit' }} fullWidth /> </a>
						<a href="" style={{lineHeight: 'inherit', cursor: 'none', paddingLeft: 0}}>
							<BitcoinPrice />
						</a>
						{/* show login button or profile link */}
						{
							user
							? <ProfileLink user={user} style={{ paddingRight: 0 }} />
							: <Button href="/welcome" style={{ lineHeight: '39px' }} raised accent ripple>Join Us</Button>
						}
					</Navigation>
				</Header>

  }
}

export default HeaderNav