const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	compilers: {
		solc: {
			version: '0.8.0',
		},
	},
	// Contracts
	contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
	// Networks
	networks: {
		// Local
		develop: {
			host: '127.0.0.1',
			port: 7545,
			network_id: 5777,
		},
		// Testnets
		rinkeby: {
			provider: () =>
				new HDWalletProvider({
					mnemonic: process.env.MNEMONIC,
					providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_PRODUCT_ID}`,
				}),
			network_id: 4,
			gas: 6500000,
			gasPrice: 20000000000,
		},
	},
}
