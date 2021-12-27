import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FundriaserCard from './FundriaserCard'

const Home = props => {
	const { appData } = props
	const [fundraisers, setFundraisers] = useState([])

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		try {
			const funds = await appData.factory.methods.fundraisers(10, 0).call()
			setFundraisers(funds)
		} catch (err) {}
	}

	return (
		<div>
			<h2>Home</h2>
			<Grid container spacing={2}>
				{fundraisers.length === 0 ? (
					<Grid item>
						<Typography>No fundraisers created yet.</Typography>
					</Grid>
				) : (
					fundraisers.map(fund => <FundriaserCard key={fund} fundraiser={fund} appData={appData} />)
				)}
			</Grid>
		</div>
	)
}

export default Home
