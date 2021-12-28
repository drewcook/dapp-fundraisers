import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Receipts = props => {
	const [donation, setDonation] = useState(null)
	const [date, setDate] = useState(null)
	const [fundName, setFundName] = useState('')
	const location = useLocation()

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (location.state) {
			const { donation, date, fundName } = location.state
			const formattedDate = new Date(parseInt(date))
			setDonation(donation)
			setDate(formattedDate.toLocaleDateString())
			setFundName(fundName)
		}
	}, [])
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<div>
			<Typography gutterBottom variant="h2" sx={{ textAlign: 'center' }}>
				Receipts
			</Typography>
			<div className="receipt-container">
				<div className="receipt-header">
					<Typography gutterBottom variant="h5">
						Thank you for your donation to {fundName}!
					</Typography>
					<Typography gutterBottom>Please review your receipt for this donation below.</Typography>
				</div>
				<div className="receipt-info">
					<div>Date of Donation: {date}</div>
					<div>Donation Value: ${donation}</div>
				</div>
			</div>
		</div>
	)
}

export default Receipts
