import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import FactoryContract from './contracts/Factory.json'
import Home from './Home'
import NewFundraiser from './NewFundraiser'
import getWeb3 from './utils/getWeb3'

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
			const walletAccounts = await web3.eth.getAccounts()
			const accounts = [
				walletAccounts[0],
				'0xFEB3061d3Bd621E497CB42b059B4639A9357c2b1',
				'0xa28C1432533f092974a87F979a8b5df84C133661',
				'0x494226D474aa3182a1cf7e19579EeB1cB5695C64',
				'0xfb0055be8f081f7e25472202f009E26fd76834bE',
				'0x8da1E48Ce0726019A5a2f369CBFBD855153D9abc',
				'0x55D8F6876B45c317900A23B5B618748C58159de4',
				'0x61f437977415653F451CC538b35157B365e2afDE',
				'0x903177BebA1c10B63da2069cFf1fCB57128250bE',
				'0x9B4Dda680fCe884B52d3BC76da3a7461bf480Ce1',
			]
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
			<AppBar position="static" color="default" sx={{ flexGrow: 1 }}>
				<Toolbar>
					<Typography variant="h6" color="inherit">
						<NavLink className="nav-link" to="/">
							Home
						</NavLink>
					</Typography>
					<Typography>
						<NavLink className="nav-link" to="new">
							New
						</NavLink>
					</Typography>
				</Toolbar>
			</AppBar>
			<Container>
				<main className="main-container">
					<Routes>
						<Route path="/" exact element={<Home appData={state} />} />
						<Route path="new" element={<NewFundraiser appData={state} />} />
					</Routes>
				</main>
			</Container>
		</div>
	)
}

export default App
