import { Container } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Explore from './Explore'
import Home from './Home'
import NewFundraiser from './NewFundraiser'
import Receipts from './Receipts'

const AppMain = props => {
	const { appData } = props

	return (
		<main className="main-container">
			<Routes>
				<Route
					path="/"
					exact
					element={
						<Container maxWidth="xl">
							<Home />
						</Container>
					}
				/>
				<Route
					path="/explore"
					exact
					element={
						<Container maxWidth="xl">
							<Explore appData={appData} />
						</Container>
					}
				/>
				<Route
					path="new"
					element={
						<Container maxWidth="md">
							<NewFundraiser appData={appData} />
						</Container>
					}
				/>
				<Route
					path="receipts"
					element={
						<Container maxWidth="md">
							<Receipts />
						</Container>
					}
				/>
			</Routes>
		</main>
	)
}

export default AppMain
