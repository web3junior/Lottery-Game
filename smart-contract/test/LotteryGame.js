const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("LotteryGame", function () {
  async function deployOneYearLockFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");

    const vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(0, 0);

    await vrfCoordinatorV2Mock.createSubscription();

    await vrfCoordinatorV2Mock.fundSubscription(1, ethers.utils.parseEther("10"))

    const lotteryGame = await LotteryGame.deploy(1, vrfCoordinatorV2Mock.address);

    return { lotteryGame, vrfCoordinatorV2Mock, owner, otherAccount };
  }

  it("Contract should request Random numbers successfully", async () => {
    const { lotteryGame, vrfCoordinatorV2Mock, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);

    await lotteryGame.connect(owner).getRandomNumber();

    const s_requestId = await lotteryGame.s_requestId();

    await expect(
      vrfCoordinatorV2Mock.fulfillRandomWords(s_requestId, lotteryGame.address)
    ).to.emit(vrfCoordinatorV2Mock, "RandomWordsFulfilled");
  });

  describe("Betting", function () {
    it("Should increase count player", async () => {
      const { lotteryGame, otherAccount } = await loadFixture(deployOneYearLockFixture);

      const count = await lotteryGame.countPlayer();
      const luckyNumber = 10;
      const betMoney = 10;

      await lotteryGame.connect(otherAccount).bet(luckyNumber, {value: betMoney});

      const countIncr = await lotteryGame.countPlayer();

      expect(count).to.equal(countIncr-1);
    });

    it("Should correct player account", async () => {
      const { lotteryGame, otherAccount } = await loadFixture(deployOneYearLockFixture);

      const luckyNumber = 10;
      const betMoney = 10;

      await lotteryGame.connect(otherAccount).bet(luckyNumber, {value: betMoney});

      const count = await lotteryGame.countPlayer();
      const player = await lotteryGame.players(count);

      expect(player.account).to.equal(otherAccount.address);
    });

    it("Fail if lucky number > 99", async () => {
      const { lotteryGame, otherAccount } = await loadFixture(deployOneYearLockFixture);

      const luckyNumber = 100;
      const betMoney = 10;

      await expect(lotteryGame.connect(otherAccount).bet(luckyNumber, {value: betMoney})).to.be.revertedWith(
        "Lucky number must be from 0 to 99"
      );
    });

    it("Fail if bet money <= 0", async () => {
      const { lotteryGame, otherAccount } = await loadFixture(deployOneYearLockFixture);

      const luckyNumber = 10;
      const betMoney = 0;

      await expect(lotteryGame.connect(otherAccount).bet(luckyNumber, {value: betMoney})).to.be.revertedWith(
        "Your bet must be greater than zero"
      );
    });
  });
});
