import { Box, Container, Typography } from '@mui/material'
import React from 'react'

const styles = {
	headlines: {
		textAlign: 'center',
		marginBottom: 4,
	},
	content: {
		textAlign: 'center',
	},
}

const Home = () => (
	<>
		<Box sx={styles.headlines}>
			<Typography gutterBottom variant="h2">
				Welcome to Fundraisers DApp
			</Typography>
			<img src="/logo.png" title="Fundraisers" alt="Fundraisers" width="200" height="200" />
			<Typography gutterBottom variant="h4" component="h3">
				Create positive change in the world!
			</Typography>
		</Box>
		<Container maxWidth="sm" sx={styles.content}>
			<Typography gutterBottom>
				This decentralized application is a space for creating fundraisers and making donations to
				them, all on the Ethereum blockchain. You should already have a wallet connected to this
				site, and therefore, you will be able to participate in both creating and donating to
				fundraisers.
			</Typography>
			<Typography gutterBottom>
				As a creator of a fundraiser, you will be able to manage the funds of that fundraiser. Other
				users can make donations in the form of Ether to your fund, and you will act as a custodian
				for these funds. You may withdraw the funds out to be donated directly into a beneficiary
				account. All of this is handled via smart contracts deployed on the Ethereum Rinkeby
				testnet. <strong>Ensure your wallet is connected and on the Rinkeby testnet.</strong>
			</Typography>
			<Typography gutterBottom>
				Check out some of the causes created by other users on the <strong>Explore</strong> page, or
				set up a new fundraiser by clicking the <strong>Create</strong> link.
			</Typography>
		</Container>
	</>
)

export default Home
