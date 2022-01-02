import React, { useEffect, useState } from 'react'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'
import AppMain from './AppMain'
import FactoryContract from './contracts/Factory.json'
import FullPageLoading from './FullPageLoading'
import './global.css'
import getWeb3 from './utils/getWeb3'
import Web3Fallback from './Web3Fallback'

const App = () => {
	const [appData, setAppData] = useState({
		web3: null,
		accounts: null,
		factory: null,
	})
	const [web3Error, setWeb3Error] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadWeb3()
	}, [])

	const loadWeb3 = async () => {
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
			setAppData({ web3, accounts, factory: instance })
			setLoading(false)
		} catch (error) {
			// Catch any errors for any of the above operations.
			setWeb3Error('Failed to load web3, accounts, or contract. Check console for details.')
			console.error(error)
			setLoading(false)
		}
	}

	if (loading) return <FullPageLoading />
	if (web3Error) return <Web3Fallback />

	return (
		<>
			<AppHeader />
			<AppMain appData={appData} />
			<AppFooter />
		</>
	)
}

export default App
