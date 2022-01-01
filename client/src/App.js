import { AppBar, Button, Container, Link, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import FactoryContract from './contracts/Factory.json'
import Home from './Home'
import NewFundraiser from './NewFundraiser'
import Receipts from './Receipts'
import getWeb3 from './utils/getWeb3'

const styles = {
	appBar: {
		flexGrow: 1,
		marginBottom: 4,
	},
	wrapper: {
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'center',
		justifyContet: 'space-between',
	},
	logo: {
		flexGrow: 1,
		textDecoration: 'none',
		color: '#333',
		cursor: 'pointer',
	},
}

const App = () => {
	const [state, setState] = useState({
		web3: null,
		accounts: null,
		factory: null,
	})

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3()
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts()
			// Get the contract instance.
			const networkId = await web3.eth.net.getId()
			const deployedNetwork = FactoryContract.networks[networkId]
			const instance = new web3.eth.Contract(
				FactoryContract.abi,
				deployedNetwork && deployedNetwork.address,
			)
			// Set web3, accounts, and factory contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			setState({ web3, accounts, factory: instance })
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`)
			console.error(error)
		}
	}

	return (
		<div>
			<AppBar position="static" color="default" sx={styles.appBar}>
				<Toolbar>
					<Link
						href="https://dco.dev/"
						underline="none"
						color="primary"
						variant="h5"
						sx={styles.logo}
						target="_blank"
					>
						{'<dco.dev />'}
					</Link>

					<Typography variant="h6" color="inherit">
						<NavLink className="nav-link" to="/">
							Fundraisers
						</NavLink>
					</Typography>
					<Typography>
						<NavLink className="nav-link" to="new">
							<Button color="primary" variant="contained">
								Add New
							</Button>
						</NavLink>
					</Typography>
				</Toolbar>
			</AppBar>
			<main className="main-container">
				<Routes>
					<Route
						path="/"
						exact
						element={
							<Container maxWidth="xl">
								<Home appData={state} />
							</Container>
						}
					/>
					<Route
						path="new"
						element={
							<Container maxWidth="md">
								<NewFundraiser appData={state} />
							</Container>
						}
					/>
					<Route
						path="receipts"
						element={
							<Container maxWidth="xl">
								<Receipts />
							</Container>
						}
					/>
				</Routes>
			</main>
		</div>
	)
}

export default App
