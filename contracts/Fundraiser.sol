// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Fundraiser is Ownable {
    using SafeMath for uint256;

    struct Donation {
        uint256 value;
        uint256 date;
    }
    mapping(address => Donation[]) private _donations;

    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);

    string public name;
    string public url;
    string public imageURL;
    string public description;

    address payable public beneficiary;

    uint256 public totalDonations;
    uint256 public donationsCount;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        address payable _beneficiary,
        address _custodian
    ) {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficiary = _beneficiary;
        _transferOwnership(_custodian);
    }

    // Fallback function
    fallback() external payable {
        // Increase donations (i.e. from anonymous donation)
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        // Add for donor
        _donations[msg.sender].push(donation);
        // Add to totals
        totalDonations = totalDonations.add(msg.value);
        donationsCount++;
        // Emit event for logs
        emit DonationReceived(msg.sender, msg.value);
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        // Since we cannot return a struct, we must construct and return a tuple that matches the schema
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }

        return (values, dates);
    }

    // transfer balance of this contract to the beneficiary payable address
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        // Emit event for logs
        emit Withdraw(balance);
    }
}
