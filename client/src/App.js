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
		contract: null,
	})

	useEffect(() => {
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
				// Set web3, accounts, and contract to the state, and then proceed with an
				// example of interacting with the contract's methods.
				setState({ web3, accounts, contract: instance })
			} catch (error) {
				// Catch any errors for any of the above operations.
				alert(`Failed to load web3, accounts, or contract. Check console for details.`)
				console.error(error)
			}
		}
		init()
	}, [])

	const runExample = async () => {
		const { accounts, contract } = state
	}

	return (
		<div>
			<nav>
				<ul>
					<li>
						<NavLink to="/">Home</NavLink>
					</li>
					<li>
						<NavLink to="new">New</NavLink>
					</li>
				</ul>
			</nav>

			<Routes>
				<Route path="/" exact element={<Home />} />
				<Route path="new" element={<NewFundraiser />} />
			</Routes>
		</div>
	)
}

export default App
