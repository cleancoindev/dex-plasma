let ether = 10**18


const EtherToken = artifacts.require("EtherToken")
const Plasma = artifacts.require("Plasma.sol")

var etherToken
var plasma

// const c1 = () =>
contract('Plasma - DepositTests', (accounts) => {
  const [operator, depositor] = accounts

  before(async () => {
    etherToken = await EtherToken.deployed()
    plasma = await Plasma.deployed()
  })


  describe('Preparing deposit with WETH', () => {
    before(async () => {
    })

    after(async () => {
    })

    it('step 1 - Wraps Ether', async () => {
      // ASSERT Auction has started
      
      await etherToken.deposit({from: depositor, value: ether});
      await etherToken.approve(Plasma.address, ether, {from: depositor})
     
    })

    it('step 2 - deposits', async () => { 
      var currentDepositBlock = (await plasma.currentDepositBlock.call()).toNumber()

      await plasma.deposit(ether, 0, {from: depositor})

      var currentDepositBlockNew = (await plasma.currentDepositBlock.call()).toNumber()

      assert.equal(currentDepositBlock+1, currentDepositBlockNew, "new deposit has not been correctly credited")
    })

  })
})  
