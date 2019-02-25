pragma solidity ^0.4.24;


/**
 * @title Merkle
 * @dev Checks that a particular leaf node is in a given Merkle tree given the index, root hash, and a proof
 */
library Merkle {

    function checkMembership(bytes32 leaf, uint256 index, bytes32 rootHash, bytes proof, uint height)
        internal
        pure
        returns (bool)
    {   
        require(proof.length == height*32);
        bytes32 proofElement;
        bytes32 computedHash = leaf;

        for (uint256 i = 32; i <= height*32; i += 32) {
            /* solhint-disable no-inline-assembly */
            assembly {
                proofElement := mload(add(proof, i))
            }
            /* solhint-enable no-inline-assembly */
            if (index % 2 == 0) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
            index = index / 2;
        }
        
        return computedHash == rootHash;
    }
}