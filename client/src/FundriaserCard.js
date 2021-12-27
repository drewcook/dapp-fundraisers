import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
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
	const { appData, fundraiser } = props
	const [contract, setContract] = useState(null)
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
			const donationsCount = await instance.methods.donationsCount().call()
			const imageURL = await instance.methods.imageURL().call()
			const url = await instance.methods.url().call()
			setFund({
				name,
				description,
				totalDonations,
				donationsCount,
				imageURL,
				url,
			})
		} catch (err) {}
	}

	return (
		<Grid item xs={12} sm={6} md={4}>
			<Box sx={styles.container}>
				<Card sx={styles.card}>
					<CardActionArea>
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
							<Typography variant="body2" color="textSecondary" component="p">
								{fund.description}
							</Typography>
						</CardContent>
					</CardActionArea>
					<CardActions>
						<Button size="small" color="primary">
							View More
						</Button>
					</CardActions>
				</Card>
			</Box>
		</Grid>
	)
}

export default FundraiserCard
