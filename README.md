# ens-xss

This is a tool that allows to register ENS names with any symbols bypassing frontend checks at ens.domains.
Specify your `PAYLOAD` and `ACCOUNT` in scripts/run.js. You have to adjust network settings in hardhat.config.js as well as specify your Etherscan API key.
After that, run `npx hardhat run scripts/run.js`