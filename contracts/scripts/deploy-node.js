const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying contracts for persistent node...");

    const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

    // Deploy SimpleAccountFactory
    const SimpleAccountFactory = await hre.ethers.getContractFactory("SimpleAccountFactory");
    const factory = await SimpleAccountFactory.deploy(ENTRYPOINT_ADDRESS);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();

    // Get implementation
    const implementationAddress = await factory.accountImplementation();

    // Deploy SimplePaymaster
    const [deployer] = await hre.ethers.getSigners();
    const SimplePaymaster = await hre.ethers.getContractFactory("SimplePaymaster");
    const paymaster = await SimplePaymaster.deploy(deployer.address);
    await paymaster.waitForDeployment();
    const paymasterAddress = await paymaster.getAddress();

    // Fund paymaster
    await deployer.sendTransaction({
        to: paymasterAddress,
        value: hre.ethers.parseEther("1.0")
    });

    console.log("\n✅ Contracts deployed!");
    console.log("Factory:", factoryAddress);
    console.log("Implementation:", implementationAddress);
    console.log("Paymaster:", paymasterAddress);

    // Save addresses
    const fs = require('fs');
    const addresses = {
        entrypoint: ENTRYPOINT_ADDRESS,
        factory: factoryAddress,
        implementation: implementationAddress,
        paymaster: paymasterAddress,
        deployer: deployer.address
    };
    fs.writeFileSync('../backend/.contract-addresses.json', JSON.stringify(addresses, null, 2));
    console.log("\n💾 Addresses saved to backend/.contract-addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
