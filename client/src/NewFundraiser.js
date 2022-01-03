import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const styles = {
	centered: {
		textAlign: 'center',
	},
	submitBtn: {
		marginTop: 2,
	},
	formCaption: {
		marginY: 3,
		textAlign: 'center',
		fontStyle: 'italic',
		color: '#555',
	},
}
const NewFundraiser = props => {
	const { appData } = props
	const [name, setFundraiserName] = useState(null)
	const [website, setFundraiserWebsite] = useState(null)
	const [description, setFundraiserDescription] = useState(null)
	const [image, setFundraiserImage] = useState(null)
	const [address, setAddress] = useState(null)

	const handleSubmit = async () => {
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
		<>
			<Box sx={styles.centered}>
				<Typography gutterBottom variant="h2">
					Create a New Fundraiser
				</Typography>
				<Typography gutterBottom>
					As the creator and owner of this fundraiser, you will act as the custodian for the
					beneficiary. You have the authority to withdraw the donation funds at any point to be
					deposited directly into the beneficiary's address. You also have the authority to set the
					beneficiary address.
				</Typography>
			</Box>
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
					label="Website URL"
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
					label="Image URL"
					variant="filled"
					margin="normal"
					onChange={e => setFundraiserImage(e.target.value)}
					placeholder="Fundraiser Image"
					fullWidth
				/>
				<TextField
					id="fundraiser-address-input"
					label="Beneficiary ETH Address"
					variant="filled"
					margin="normal"
					onChange={e => setAddress(e.target.value)}
					placeholder="0x0000000000000000000000000000000000000000"
					fullWidth
				/>
				<Button
					variant="contained"
					color="primary"
					size="large"
					onClick={handleSubmit}
					fullWidth
					sx={styles.submitBtn}
				>
					Create Fundraiser
				</Button>
			</form>
			<Typography gutterBottom sx={styles.formCaption} variant="body2">
				All fields are required. The beneficiary address must be a valid ETH address for the funds
				to be deposited into.
			</Typography>
		</>
	)
}

export default NewFundraiser
