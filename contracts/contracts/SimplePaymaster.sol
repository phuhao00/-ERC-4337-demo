// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SimplePaymaster
 * @dev A simplified paymaster for demonstration
 * This is a basic implementation that allows the owner to sponsor gas fees
 */
contract SimplePaymaster is Ownable {
    using ECDSA for bytes32;

    address public verifyingSigner;
    
    event SignerChanged(address indexed oldSigner, address indexed newSigner);
    event Received(address indexed sender, uint256 amount);

    constructor(address _verifyingSigner) Ownable(msg.sender) {
        require(_verifyingSigner != address(0), "SimplePaymaster: signer is zero address");
        verifyingSigner = _verifyingSigner;
    }

    /**
     * @dev Set a new verifying signer address
     */
    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "SimplePaymaster: new signer is zero address");
        address oldSigner = verifyingSigner;
        verifyingSigner = newSigner;
        emit SignerChanged(oldSigner, newSigner);
    }

    /**
     * @dev Verify a signature for sponsoring gas
     * @param hash The hash that was signed
     * @param signature The signature to verify
     * @return bool True if signature is valid
     */
    function verifySignature(bytes32 hash, bytes memory signature) public view returns (bool) {
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address recoveredSigner = ECDSA.recover(ethSignedHash, signature);
        return recoveredSigner == verifyingSigner;
    }

    /**
     * @dev Withdraw funds from the paymaster
     */
    function withdraw(address payable recipient, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "SimplePaymaster: insufficient balance");
        recipient.transfer(amount);
    }

    /**
     * @dev Get the paymaster's balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
