const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  console.log('Deploying AgroChain contracts...');

  // Deploy NFT Contract
  const AgroChainNFT = await ethers.getContractFactory('AgroChainNFT');
  const nftContract = await AgroChainNFT.deploy();
  await nftContract.deployed();
  console.log('AgroChainNFT deployed to:', nftContract.address);

  // Deploy Marketplace Contract
  const AgroChainMarketplace = await ethers.getContractFactory('AgroChainMarketplace');
  const marketplaceContract = await AgroChainMarketplace.deploy(nftContract.address);
  await marketplaceContract.deployed();
  console.log('AgroChainMarketplace deployed to:', marketplaceContract.address);

  // Deploy Supply Chain Contract
  const AgroChainSupplyChain = await ethers.getContractFactory('AgroChainSupplyChain');
  const supplyChainContract = await AgroChainSupplyChain.deploy(nftContract.address);
  await supplyChainContract.deployed();
  console.log('AgroChainSupplyChain deployed to:', supplyChainContract.address);

  // Save contract addresses
  const contracts = {
    nftContract: nftContract.address,
    marketplaceContract: marketplaceContract.address,
    supplyChainContract: supplyChainContract.address,
    network: network.name,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    'contracts/deployed-addresses.json',
    JSON.stringify(contracts, null, 2)
  );

  console.log('Contract addresses saved to contracts/deployed-addresses.json');

  // Verify contracts on Polygonscan (if on mainnet/testnet)
  if (network.name !== 'hardhat' && network.name !== 'localhost') {
    console.log('Waiting for block confirmations...');
    await nftContract.deployTransaction.wait(6);
    await marketplaceContract.deployTransaction.wait(6);
    await supplyChainContract.deployTransaction.wait(6);

    console.log('Verifying contracts...');
    
    try {
      await hre.run('verify:verify', {
        address: nftContract.address,
        constructorArguments: [],
      });
      console.log('NFT contract verified');
    } catch (error) {
      console.error('NFT contract verification failed:', error.message);
    }

    try {
      await hre.run('verify:verify', {
        address: marketplaceContract.address,
        constructorArguments: [nftContract.address],
      });
      console.log('Marketplace contract verified');
    } catch (error) {
      console.error('Marketplace contract verification failed:', error.message);
    }

    try {
      await hre.run('verify:verify', {
        address: supplyChainContract.address,
        constructorArguments: [nftContract.address],
      });
      console.log('Supply chain contract verified');
    } catch (error) {
      console.error('Supply chain contract verification failed:', error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
