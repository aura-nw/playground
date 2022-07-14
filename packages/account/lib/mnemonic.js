"use strict";

var bip39 = require("bip39");
const amino = require("@cosmjs/amino");

async function generateAccount() {
  // Generate from mnemonic
  let mnemonic = bip39.generateMnemonic();
  let privateKey = await amino.Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "aura"
  });
  let privateResult = await privateKey.getAccounts();

  let pubkeys = amino.encodeSecp256k1Pubkey(privateResult[0].pubkey);
  let address = privateResult[0].address;


  let result = {
    PrivateKey: await privateKey.serialize('password'),
    Address: address
  };

  return result;
}

module.exports = {
  generateAccount
};
