require("@nomiclabs/hardhat-waffle");
const { utils } = require("ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_API_KEY = "38f3133d576146e6a933dcecb074c36b";

const ROPSTEN_PRIVATE_KEY = "91d3b37724d740d9067b633554fb73c888476ddf94701b9ab1fd2e23c6aa812d";
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    // hardhat: {
    //   accounts: {
    //     accountsBalance: utils.parseEther("1000000").toString(),
    //   },
      // gasPrice: 1000,
    // },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    },
    gasPrice: 20000000000,
    gas: 6000000,
  },
  solidity: "0.8.4",
};
