const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment to Hardhat network...");

    // Get the EntryPoint address
    const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

    console.log("📍 Using EntryPoint:", ENTRYPOINT_ADDRESS);

    // Deploy SimpleAccountFactory
    console.log("\n📦 Deploying SimpleAccountFactory...");
    const SimpleAccountFactory = await hre.ethers.getContractFactory("SimpleAccountFactory");
    const factory = await SimpleAccountFactory.deploy(ENTRYPOINT_ADDRESS);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ SimpleAccountFactory deployed to:", factoryAddress);

    // Get the implementation address
    const implementationAddress = await factory.accountImplementation();
    console.log("✅ SimpleAccount implementation:", implementationAddress);

    // Deploy SimplePaymaster
    console.log("\n📦 Deploying SimplePaymaster...");
    const [deployer] = await hre.ethers.getSigners();
    const SimplePaymaster = await hre.ethers.getContractFactory("SimplePaymaster");
    const paymaster = await SimplePaymaster.deploy(
        deployer.address // Use deployer as initial signer
    );
    await paymaster.waitForDeployment();
    const paymasterAddress = await paymaster.getAddress();
    console.log("✅ SimplePaymaster deployed to:", paymasterAddress);

    // Fund the paymaster
    console.log("\n💰 Funding Paymaster...");
    const fundTx = await deployer.sendTransaction({
        to: paymasterAddress,
        value: hre.ethers.parseEther("1.0")
    });
    await fundTx.wait();
    console.log("✅ Paymaster funded with 1.0 ETH");

    console.log("\n🎉 Deployment completed!");
    console.log("\n📋 Contract Addresses:");
    console.log("EntryPoint:", ENTRYPOINT_ADDRESS);
    console.log("Factory:", factoryAddress);
    console.log("Account Implementation:", implementationAddress);
    console.log("Paymaster:", paymasterAddress);
    console.log("Deployer:", deployer.address);

    console.log("\n📝 Update your backend/.env file with these addresses:");
    console.log(`FACTORY_ADDRESS=${factoryAddress}`);
    console.log(`ACCOUNT_IMPLEMENTATION_ADDRESS=${implementationAddress}`);
    console.log(`PAYMASTER_ADDRESS=${paymasterAddress}`);

    // Save to file
    const fs = require('fs');
    const deploymentInfo = {
        network: hre.network.name,
        entrypoint: ENTRYPOINT_ADDRESS,
        factory: factoryAddress,
        implementation: implementationAddress,
        paymaster: paymasterAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
        'deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
