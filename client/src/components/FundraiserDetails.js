import { Launch } from '@mui/icons-material'
import {
	Box,
	Button,
	CardMedia,
	CircularProgress,
	Divider,
	FilledInput,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	Link as Anchor,
	TextField,
	Typography,
} from '@mui/material'
import CryptoCompare from 'cryptocompare'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FundraiserContract from '../contracts/Fundraiser.json'
import formatNumber from '../utils/formatNumber'

const styles = {
	centered: {
		textAlign: 'center',
	},
	spinner: {
		marginX: 'auto',
		marginY: 4,
	},
	media: {
		width: '100%',
		backgroundColor: '#333',
		height: 300,
		borderBottom: '1px solid #ccc',
	},
	verticalSpacing: {
		marginY: 3,
	},
	ethAmount: {
		fontWeight: 500,
		fontSize: '0.9rem',
		color: '#a1a1a1',
	},
	donationRow: {
		paddingY: 3,
		display: 'flex',
		justifyContent: 'space-between',
	},
	ownerActionBtn: {
		marginTop: 1,
	},
	updateDetailsBtn: {
		marginRight: 1,
		marginY: 1,
	},
}

const FundraisersDetails = props => {
	const { appData } = props
	const location = useLocation()
	const [loading, setLoading] = useState(true)
	const [beneficiary, setNewBeneficiary] = useState('')
	const [donateAmount, setDonateAmount] = useState('')
	const [donateAmountEth, setDonateAmountEth] = useState('')
	const [donationAmount, setDonationAmount] = useState('')
	const [donationAmountEth, setDonationAmountEth] = useState(0)
	const [editedDetails, setEditedDetails] = useState({
		name: null, //details.name,
		description: null, //details.description,
		imageURL: null, //details.imageURL,
		url: null, //details.url,
	})
	const [isOwner, setIsOwner] = useState(false)
	const [isEditingDetails, setIsEditingDetails] = useState(false)
	const [userDonations, setUserDonations] = useState(null)
	const [contract, setContract] = useState(null)
	const [exchangeRate, setExchangeRate] = useState(null)
	const [details, setDetails] = useState(null)

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (location.state) {
			console.log('has state', location.state)
		}
		init()
	}, [])
	/* eslint-enable react-hooks/exhaustive-deps */

	const init = async () => {
		try {
			// Get contract for given fundraiser contract address
			const fundAddress = location.pathname.split('/')[2]
			const instance = new appData.web3.eth.Contract(FundraiserContract.abi, fundAddress)
			setContract(instance)
			// Read contract data and construct fundraiser details and donations data
			const name = await instance.methods.name().call()
			const description = await instance.methods.description().call()
			const imageURL = await instance.methods.imageURL().call()
			const url = await instance.methods.url().call()
			const xRate = await CryptoCompare.price('ETH', ['USD'])
			const donationAmount = await instance.methods.totalDonations().call()
			const donationAmountETH = await appData.web3.utils.fromWei(donationAmount, 'ether')
			const donationAmountUSD = xRate.USD * donationAmountETH
			setExchangeRate(xRate)
			setDonationAmount(donationAmountUSD)
			setDonationAmountEth(donationAmountETH)
			setDetails({
				name,
				description,
				imageURL,
				url,
			})
			setEditedDetails({
				name,
				description,
				imageURL,
				url,
			})
			// User donations
			const myDonations = await instance.methods.myDonations().call({ from: appData.accounts[0] })
			setUserDonations(myDonations)

			// Set owner
			const userAcct = appData.accounts[0]
			const ownerAcct = await instance.methods.owner().call()
			if (userAcct === ownerAcct) {
				setIsOwner(true)
			}

			setLoading(false)
		} catch (err) {
			console.error(err)
		}
	}

	const handleDonationChange = e => {
		const value = e.target.value
		const ethValue = value / exchangeRate.USD || 0
		setDonateAmount(value)
		setDonateAmountEth(ethValue)
	}

	const handleDonate = async () => {
		try {
			const ethAmount = donationAmount / exchangeRate.USD || 0
			const donation = appData.web3.utils.toWei(ethAmount.toString())
			await contract.methods.donate().send({
				from: appData.accounts[0],
				value: donation,
				gas: 650000,
			})
			// onSuccess('Donation accepted')
		} catch (err) {
			console.error(err)
		}
	}

	const handleSetBeneficiary = async () => {
		try {
			await contract.methods.setBeneficiary(beneficiary).send({
				from: appData.accounts[0],
			})
			// onSuccess('Fundraiser beneficiary has been changed')
		} catch (err) {
			console.error(err)
		}
	}

	const handleWithdrawal = async () => {
		try {
			await contract.methods.withdraw().send({
				from: appData.accounts[0],
			})
			// onSuccess('Available funds withdrawn and deposited to beneficiary')
		} catch (err) {
			console.error(err)
		}
	}

	const handleEditDetails = async () => {
		try {
			const { name, description, url, imageURL } = editedDetails
			await contract.methods.updateDetails(name, description, url, imageURL).send({
				from: appData.accounts[0],
				gas: 650000,
			})
			// onSuccess('Fundraiser details updated')
		} catch (err) {
			console.error(err)
		}
	}

	const handleCancelEditDetails = async () => {
		setIsEditingDetails(false)
		setEditedDetails({
			name: details.name,
			description: details.description,
			imageURL: details.imageURL,
			url: details.url,
		})
	}

	const displayMyDonations = () => {
		const donations = userDonations
		if (donations === null) return null

		// Construct donations list
		const totalDonations = donations.values.length
		let donationsList = []
		for (let i = 0; i < totalDonations; i++) {
			const ethAmount = appData.web3.utils.fromWei(donations.values[i])
			const userDonation = exchangeRate.USD * ethAmount
			const donationDate = donations.dates[i]
			donationsList.push({
				donationAmountUSD: formatNumber(userDonation),
				donationAmountETH: ethAmount,
				date: donationDate,
			})
		}

		if (donationsList.length === 0)
			return (
				<Box>
					<Typography gutterBottom variant="body2">
						You haven't made any donations to this fundraiser yet.
					</Typography>
				</Box>
			)

		return donationsList.map(donation => (
			<Fragment key={donation.date}>
				<Box sx={styles.donationRow}>
					<Box>
						<Typography>${donation.donationAmountUSD}</Typography>
						<Typography sx={styles.ethAmount}>({donationAmountEth} ETH)</Typography>
					</Box>
					<Link
						className="donation-receipt-link"
						to="/receipts"
						state={{
							donation: donation.donationAmount,
							date: donation.date,
							fundName: details.name,
						}}
					>
						<Button variant="outlined" color="primary" size="small">
							Request Receipt
						</Button>
					</Link>
				</Box>
				<Divider light />
			</Fragment>
		))
	}

	if (loading)
		return (
			<Grid item xs={12} sx={styles.centered}>
				<CircularProgress size={30} sx={styles.spinner} />
			</Grid>
		)

	if (!details) return null

	if (details)
		return (
			<>
				<Link className="back-button" to="/explore">
					<Button variant="contained" color="primary">
						Back to list
					</Button>
				</Link>
				<Box sx={styles.verticalSpacing}>
					<Typography variant="h2">
						Fundraiser Details <small>{details.name}</small>
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<CardMedia
							sx={styles.media}
							component="img"
							image={details.imageURL}
							title="Fundraiser Image"
						/>
						<Typography sx={styles.verticalSpacing}>{details.description}</Typography>
						<Typography sx={styles.verticalSpacing}>
							<Anchor href={details.url} underline="none" color="inherit">
								<Button color="primary" endIcon={<Launch />}>
									View Website
								</Button>
							</Anchor>
						</Typography>
						<Divider />
						<Box sx={styles.verticalSpacing}>
							<Typography gutterBottom variant="h6">
								Make a Donation
							</Typography>
							<FormControl variant="filled" fullWidth margin="normal">
								<InputLabel htmlFor="donation-amount-input">Donation Amount</InputLabel>
								<FilledInput
									id="donation-amount-input"
									value={donateAmount}
									placeholder="0.00"
									onChange={e => handleDonationChange(e)}
									startAdornment={<InputAdornment position="start">$</InputAdornment>}
									fullWidth
								/>
							</FormControl>
							<Typography sx={styles.ethAmount}>({donateAmountEth} ETH)</Typography>
							<Button
								onClick={handleDonate}
								variant="contained"
								color="primary"
								sx={{ marginY: 1 }}
							>
								Donate
							</Button>
						</Box>
					</Grid>
					<Grid item xs={12} md={5}>
						<Box sx={styles.verticalSpacing}>
							<Typography gutterBottom variant="h6">
								My Donations
							</Typography>
							{displayMyDonations()}
						</Box>
						{isOwner && (
							<>
								<Typography gutterBottom variant="h5">
									Owner Actions
								</Typography>
								<Typography gutterBottom>
									As the owner of this fundraiser, you have a couple actions available to perform.
								</Typography>
								<Box sx={styles.verticalSpacing}>
									<Typography variant="h6">Update Details</Typography>
									<Typography gutterBottom>
										Edit the details of your fundraiser, including the name, description, website
										URL, and image URL.
									</Typography>
									{!isEditingDetails ? (
										<Button
											variant="contained"
											color="secondary"
											onClick={() => setIsEditingDetails(true)}
											sx={styles.ownerActionBtn}
										>
											Edit
										</Button>
									) : (
										<>
											<Button
												variant="contained"
												color="secondary"
												onClick={handleEditDetails}
												sx={styles.updateDetailsBtn}
											>
												Update
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												onClick={handleCancelEditDetails}
											>
												Cancel
											</Button>
											<TextField
												id="fundraiser-name-input"
												label="Name"
												variant="filled"
												margin="normal"
												value={editedDetails.name}
												onChange={e => setEditedDetails({ ...editedDetails, name: e.target.value })}
												placeholder="Fundraiser Name"
												fullWidth
											/>
											<TextField
												id="fundraiser-description-input"
												label="Description"
												variant="filled"
												margin="normal"
												value={editedDetails.description}
												onChange={e =>
													setEditedDetails({ ...editedDetails, description: e.target.value })
												}
												placeholder="Fundraiser Description"
												fullWidth
											/>
											<TextField
												id="fundraiser-website-input"
												label="Website URL"
												variant="filled"
												margin="normal"
												value={editedDetails.url}
												onChange={e => setEditedDetails({ ...editedDetails, url: e.target.value })}
												placeholder="Fundraiser Website URL"
												fullWidth
											/>
											<TextField
												id="fundraiser-image-input"
												label="Image URL"
												variant="filled"
												margin="normal"
												value={editedDetails.imageURL}
												onChange={e =>
													setEditedDetails({ ...editedDetails, imageURL: e.target.value })
												}
												placeholder="Fundraiser Image"
												fullWidth
											/>
										</>
									)}
								</Box>
								<Box sx={styles.verticalSpacing}>
									<Typography variant="h6">Set Beneficiary</Typography>
									<Typography>
										Set a new beneficiary wallet address for this fundraiser. The beneficiary wallet
										will receive all of the funds when withdrawn.
									</Typography>
									<FormControl variant="filled" fullWidth margin="normal">
										<InputLabel htmlFor="set-beneficiary-input">Beneficiary ETH Address</InputLabel>
										<FilledInput
											id="set-beneficiary-input"
											value={beneficiary}
											placeholder="0x0000000000000000000000000000000000000000"
											onChange={e => setNewBeneficiary(e.target.value)}
											fullWidth
										/>
									</FormControl>
									<Button
										variant="contained"
										color="secondary"
										onClick={handleSetBeneficiary}
										sx={styles.ownerActionBtn}
									>
										Set Beneficiary
									</Button>
								</Box>
								<Box sx={styles.verticalSpacing}>
									<Typography gutterBottom variant="h6">
										Withdraw Funds
									</Typography>
									<Typography gutterBottom>
										You may withdraw all of the funds currently tied to this fundraiser. The funds
										will be directly deposited into the beneficiary's wallet.
									</Typography>
									<Button
										variant="contained"
										color="secondary"
										onClick={handleWithdrawal}
										sx={styles.ownerActionBtn}
									>
										Withdrawal
									</Button>
								</Box>
							</>
						)}
					</Grid>
				</Grid>
			</>
		)
}

export default FundraisersDetails
