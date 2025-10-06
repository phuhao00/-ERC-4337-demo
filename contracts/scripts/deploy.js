const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment...");

    // Get the EntryPoint address (use the official ERC-4337 EntryPoint)
    // Sepolia: 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
    const ENTRYPOINT_ADDRESS = process.env.ENTRYPOINT_ADDRESS || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

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
        value: hre.ethers.parseEther("0.1")
    });
    await fundTx.wait();
    console.log("✅ Paymaster funded with 0.1 ETH");

    console.log("\n🎉 Deployment completed!");
    console.log("\n📋 Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("EntryPoint:              ", ENTRYPOINT_ADDRESS);
    console.log("SimpleAccountFactory:    ", factoryAddress);
    console.log("SimpleAccount Template:  ", implementationAddress);
    console.log("VerifyingPaymaster:      ", paymasterAddress);
    console.log("Paymaster Signer:        ", deployer.address);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Save addresses to config file
    const fs = require("fs");
    const config = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        entryPoint: ENTRYPOINT_ADDRESS,
        factory: factoryAddress,
        accountImplementation: implementationAddress,
        paymaster: paymasterAddress,
        paymasterSigner: deployer.address
    };

    fs.writeFileSync(
        `../backend/config/contracts-${hre.network.name}.json`,
        JSON.stringify(config, null, 2)
    );
    console.log(`\n💾 Config saved to backend/config/contracts-${hre.network.name}.json`);

    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n🔍 To verify contracts, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${factoryAddress} ${ENTRYPOINT_ADDRESS}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${paymasterAddress} ${ENTRYPOINT_ADDRESS} ${deployer.address}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
