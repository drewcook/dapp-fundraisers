import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FilledInput,
	FormControl,
	InputAdornment,
	InputLabel,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import FundraiserContract from './contracts/Fundraiser.json'

const styles = {
	container: {},
	card: {},
	media: {
		width: '100%',
		height: 'auto',
		backgroundColor: '#333',
	},
}

const FundraiserCard = props => {
	const { appData, fundraiser, onDonate } = props
	const [contract, setContract] = useState(null)
	const [open, setOpen] = useState(false)
	const [donationAmount, setDonationAmount] = useState('')
	const [fund, setFund] = useState({
		name: null,
		description: null,
		totalDonations: null,
		donationsCount: null,
		imageURL: null,
		url: null,
	})

	useEffect(() => {
		if (fundraiser) init(fundraiser)
	}, [fundraiser])

	const init = async () => {
		try {
			// Get contract for given fundraiser contract address
			const instance = new appData.web3.eth.Contract(FundraiserContract.abi, fundraiser)
			setContract(instance)
			// Read contract data and construct fundraiser data
			const name = await instance.methods.name().call()
			const description = await instance.methods.description().call()
			const totalDonations = await instance.methods.totalDonations().call()
			const totalDonationsEth = await appData.web3.utils.fromWei(totalDonations, 'ether')
			const donationsCount = await instance.methods.donationsCount().call()
			const imageURL = await instance.methods.imageURL().call()
			const url = await instance.methods.url().call()
			setFund({
				name,
				description,
				totalDonations: totalDonationsEth,
				donationsCount,
				imageURL,
				url,
			})
		} catch (err) {}
	}

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleDonate = async () => {
		const donation = appData.web3.utils.toWei(donationAmount)

		await contract.methods.donate().send({
			from: appData.accounts[0],
			value: donation,
			gas: 650000,
		})
		onDonate()
		handleClose()
	}

	const FundraiserDialog = () => (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="fundraiser-dialog-title"
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="fundraiser-dialog-title">Donate to {fund.name}</DialogTitle>
			<DialogContent>
				<CardMedia
					sx={styles.media}
					component="img"
					image={fund.imageURL}
					title="Fundraiser Image"
				/>
				<DialogContentText sx={{ marginY: 3 }}>{fund.description}</DialogContentText>
				<FormControl variant="filled" fullWidth margin="normal">
					<InputLabel htmlFor="fundraiser-donation-amount">Donation Amount</InputLabel>
					<FilledInput
						fullWidth
						id="fundraiser-donation-amount"
						value={donationAmount}
						placeholder="0.00000000000"
						onChange={e => setDonationAmount(e.target.value)}
						endAdornment={<InputAdornment position="end">ETH</InputAdornment>}
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleDonate} variant="contained" color="primary">
					Donate
				</Button>
			</DialogActions>
		</Dialog>
	)

	return (
		<Box sx={styles.container}>
			<Card sx={styles.card}>
				<CardActionArea onClick={handleOpen}>
					<CardMedia
						sx={styles.media}
						component="img"
						image={fund.imageURL}
						title="Fundraiser Image"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{fund.name}
						</Typography>
						<Typography
							gutterBottom
							variant="body2"
							color="textSecondary"
							component="p"
							sx={{ marginBottom: 3 }}
						>
							{fund.description?.substring(0, 240) + '...'}
						</Typography>
						<Typography variant="h5" color="textSecondary" component="p">
							Amount Raised: {fund.totalDonations} ETH
						</Typography>
						<Typography variant="h6" color="textSecondary" component="p">
							Total Donations: {fund.donationsCount}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions sx={{ justifyContent: 'flex-end', padding: 3 }}>
					<Button variant="contained" color="info" onClick={handleOpen}>
						View More
					</Button>
				</CardActions>
				{FundraiserDialog()}
			</Card>
		</Box>
	)
}

export default FundraiserCard
