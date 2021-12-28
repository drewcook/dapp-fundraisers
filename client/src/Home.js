import { CircularProgress, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FundriaserCard from './FundriaserCard'

const Home = props => {
	const { appData } = props
	const [fundraisers, setFundraisers] = useState([])
	const [totalCount, setTotalCount] = useState(null)
	const [loading, setLoading] = useState(true)
	const [errorMsg, setErrorMsg] = useState(null)

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		init()
	}, [])

	useEffect(() => {
		init()
	}, [appData])

	useEffect(() => {
		displayContent()
	}, [loading, errorMsg, fundraisers])
	/* eslint-enable react-hooks/exhaustive-deps */

	const init = async () => {
		try {
			if (appData.factory) fetchFundraisers()
		} catch (err) {
			console.error('Init Error:', err.message)
		}
	}

	const fetchFundraisers = async () => {
		setLoading(true)
		setErrorMsg(null)
		try {
			const newFunds = await appData.factory.methods.fundraisers(10, 0).call()
			const newCount = await appData.factory.methods.fundraisersCount().call()
			setFundraisers(newFunds)
			setTotalCount(newCount)
			setLoading(false)
		} catch (err) {
			console.error(err.message)
			setLoading(false)
			setErrorMsg('An error occurred while fetching fundraisers. Please check console.')
		}
	}

	const displayContent = () => {
		if (loading)
			return (
				<Grid item xs={12} sx={{ textAlign: 'center' }}>
					<CircularProgress size={30} sx={{ marginX: 'auto', marginY: 4 }} />
				</Grid>
			)

		if (errorMsg)
			return (
				<Grid item xs={12}>
					<Typography gutterBottom color="error" sx={{ textAlign: 'center' }}>
						{errorMsg}
					</Typography>
				</Grid>
			)

		if (fundraisers.length > 0)
			return fundraisers.map((fund, idx) => (
				<Grid item xs={12} sm={6} lg={4} key={idx}>
					<FundriaserCard fundraiser={fund} appData={appData} onDonate={fetchFundraisers} />
				</Grid>
			))

		return (
			<Grid item xs={12}>
				<Typography gutterBottom variant="overline">
					No fundraisers created yet.
				</Typography>
			</Grid>
		)
	}

	return (
		<div>
			<Typography gutterBottom variant="h2" sx={{ textAlign: 'center' }}>
				Home
			</Typography>
			<Grid container spacing={2}>
				{totalCount && (
					<Grid item xs={12}>
						<Typography gutterBottom sx={{ textAlign: 'center' }}>
							{totalCount} Total Fundraisers to donate to
						</Typography>
					</Grid>
				)}
				{displayContent()}
			</Grid>
		</div>
	)
}

export default Home
