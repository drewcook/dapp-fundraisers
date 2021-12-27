import { Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const NewFundraiser = props => {
	const { appData } = props
	const [name, setFundraiserName] = useState(null)
	const [website, setFundraiserWebsite] = useState(null)
	const [description, setFundraiserDescription] = useState(null)
	const [image, setFundraiserImage] = useState(null)
	const [address, setAddress] = useState(null)
	// const [custodian, setCustodian] = useState(null)

	const handleSubmit = async () => {
		console.log(appData.factory.methods)
		try {
			await appData.factory.methods
				.createFundraiser(name, website, image, description, address)
				.send({ from: appData.accounts[0] })

			alert('Successfully created fundraiser')
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div>
			<Typography gutterBottom variant="h2" sx={{ textAlign: 'center' }}>
				Create a New Fundraiser
			</Typography>
			<Typography gutterBottom sx={{ textAlign: 'center' }}>
				Fill out the form below to create a new fundraiser. Your fundraiser must have a valid
				beneficiary ETH address for the funds to be deposited into.
			</Typography>
			<Typography gutterBottom sx={{ textAlign: 'center' }}>
				You, as the creator and owner of this fundraiser, will act as the custodian for the
				beneficiary by withdrawing the donation funds to be deposited directly into the
				beneficiary's address. the beneficiary address. Also, as the owner, you have the permissions
				to update the beneficiary's address whenever you please.
			</Typography>
			<form>
				<TextField
					id="fundraiser-name-input"
					label="Name"
					variant="filled"
					margin="normal"
					onChange={e => setFundraiserName(e.target.value)}
					placeholder="Fundraiser Name"
					fullWidth
				/>
				<TextField
					id="fundraiser-website-input"
					label="Website"
					variant="filled"
					margin="normal"
					onChange={e => setFundraiserWebsite(e.target.value)}
					placeholder="Fundraiser Website URL"
					fullWidth
				/>
				<TextField
					id="fundraiser-description-input"
					label="Description"
					variant="filled"
					margin="normal"
					onChange={e => setFundraiserDescription(e.target.value)}
					placeholder="Fundraiser Description"
					fullWidth
				/>

				<TextField
					id="fundraiser-image-input"
					label="Image"
					variant="filled"
					margin="normal"
					onChange={e => setFundraiserImage(e.target.value)}
					placeholder="Fundraiser Image"
					fullWidth
				/>
				<TextField
					id="fundraiser-address-input"
					label="Address"
					variant="filled"
					margin="normal"
					onChange={e => setAddress(e.target.value)}
					placeholder="Fundraiser Ethereum Address"
					fullWidth
				/>
				{/* <TextField
					id="fundraiser-custodian-input"
					label="Custodian"
					variant="filled"
					margin="normal"
					onChange={e => setCustodian(e.target.value)}
					placeholder="Fundraiser Custodian"
					fullWidth
				/> */}
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					Submit
				</Button>
			</form>
		</div>
	)
}

export default NewFundraiser
