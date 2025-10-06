// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./SimpleAccount.sol";

/**
 * @title SimpleAccountFactory
 * @dev Factory contract for creating SimpleAccount instances using CREATE2
 */
contract SimpleAccountFactory {
    SimpleAccount public immutable accountImplementation;

    event AccountCreated(address indexed account, address indexed owner, uint256 salt);

    constructor(IEntryPoint anEntryPoint) {
        accountImplementation = new SimpleAccount(anEntryPoint);
    }

    /**
     * @dev Create an account, and return its address.
     * Returns the address even if the account is already deployed.
     * @param owner The owner of the account to be created
     * @param salt Unique salt for CREATE2
     */
    function createAccount(address owner, uint256 salt) public returns (SimpleAccount ret) {
        address addr = getAddress(owner, salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return SimpleAccount(payable(addr));
        }
        ret = SimpleAccount(payable(new ERC1967Proxy{salt: bytes32(salt)}(
            address(accountImplementation),
            abi.encodeCall(SimpleAccount.initialize, (owner))
        )));
        emit AccountCreated(address(ret), owner, salt);
    }

    /**
     * @dev Calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(
                address(accountImplementation),
                abi.encodeCall(SimpleAccount.initialize, (owner))
            )
        )));
    }
}
