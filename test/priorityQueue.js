const PriorityQueue = artifacts.require("PriorityQueue")

const { catchError } = require("./utilities.js")

contract("PriorityQueue", async (accounts) => {
  let instance
  before (async () => {
    instance = await PriorityQueue.new()
  })

  it("Add then remove", async () => {
    await instance.insert(2, 2)
    await instance.insert(1, 2)
    await instance.insert(3, 2)

    assert.equal(parseInt(await instance.getMin()), 1, "Did not delete correct minimum")
    await instance.delMin()
    assert.equal(parseInt(await instance.getMin()), 2, "Did not delete correct minimum")
    await instance.delMin()
    assert.equal(parseInt(await instance.getMin()), 3, "Did not delete correct minimum")
    await instance.delMin()
    assert(await instance.currentSize.call() == 0, "Size is not zero")
  })

  it("Ascending insert", async () => {
    let currSize = parseInt(await instance.currentSize.call())
    for (let i = 1; i < 6; i++) {
      await instance.insert(i, i)
    }

    currSize = parseInt(await instance.currentSize.call())
    assert.equal(currSize, 5, "currentSize did not increment")

    let min = parseInt(await instance.getMin())
    assert.equal(1, min, "getMin did not return the minimum")

    for (let i = 0; i < 3; i++) {
      await instance.delMin()
    }

    min = parseInt(await instance.getMin())
    currSize = parseInt(await instance.currentSize.call())
    assert.equal(min, 4, "delMin deleted priorities out of order")
    assert.equal(currSize, 2, "currSize did not decrement")
    // Clear the queue
    for (let i = 0; i < 2; i++) {
      await instance.delMin()
    }
    currSize = parseInt(await instance.currentSize.call())
    assert.equal(currSize, 0, "The priority queue has not been emptied")
  })

  it ("Insert from someone other than owner", async () => {
    const [err] = await catchError(instance.insert(3, 3, {"from": accounts[1]}))
    if (!err) {
      assert(false, "Insert allowed for someone other than owner")
    }

    const currSize = parseInt(await instance.currentSize.call())
    assert.equal(currSize, 0, "Insert allowed for someone other than owner")
  })

  it("Insert, delete min, insert again", async () => {
    for (let i = 1; i < 6; i++) {
      await instance.insert(i, i)
      const min = parseInt(await instance.getMin())
      assert.equal(min, 1, "getMin does not return minimum element in pq.")
    }

    // partially clear the pq
    for (let i = 0; i < 3; i++) {
      await instance.delMin()
    }
    let min = parseInt(await instance.getMin())
    assert.equal(min, 4, "delMin deleted priorities out of order")

    // insert to pq after partial delete
    for (let i = 2; i < 4; i++) {
      await instance.insert(i, i)
      min = parseInt(await instance.getMin())
      assert.equal(min, 2, "getMin does not return minimum element in pq.")
    }
    // clear the pq
    for (let i = 0; i < 4; i++) {
      await instance.delMin()
    }
    const currSize = parseInt(await instance.currentSize.call())
    assert.equal(currSize, 0, "The priority queue has not been emptied")
  })

  it ("Insert same priorities", async () => {
    let currentSize = parseInt(await instance.currentSize.call())
    assert.equal(currentSize, 0, "The size is not 0")

    await instance.insert(10, 10)
    let min = parseInt(await instance.getMin())
    currentSize = parseInt(await instance.currentSize.call())
    assert.equal(currentSize, 1, "The size is not 0")

    // Breaks here - has min as 0
    assert.equal(min, 10, "First insert did not work")

    await instance.insert(10, 10)
    min = parseInt(await instance.getMin())
    assert.equal(min, 10, "Second insert of same priority did not work")
    await instance.insert(5, 5)
    await instance.insert(5, 5)

    currentSize = parseInt(await instance.currentSize.call())
    assert.equal(currentSize, 4, "The currentSize is incorrect")

    await instance.delMin()
    min = parseInt(await instance.getMin())
    assert.equal(min, 5, "PriorityQueue did not handle same priorities correctly")

    await instance.delMin()
    await instance.delMin()

    min = parseInt(await instance.getMin())
    assert.equal(min, 10, "PriorityQueue did not delete duplicate correctly")

    await instance.delMin()
    assert.equal(await instance.currentSize.call(), 0)
  })
})