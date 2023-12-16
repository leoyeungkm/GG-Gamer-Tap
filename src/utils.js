import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { PROGRAM_ID } from "./constants";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

async function getPDAPublicKey(seeds, programId) {
  return (await getPDA(seeds, programId))[0];
}

function getPDA(seeds, programId) {
  return PublicKey.findProgramAddressSync(
    seeds,
    programId
);
}

const getMetadata = async (mint) => {
  return await getPDAPublicKey(
    [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID,
  );
};

const getMasterEdition = async (mint) => {
  return await getPDAPublicKey(
    [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
    TOKEN_METADATA_PROGRAM_ID,
  );
};


const getUserData = async (mintAuthority) => {
  return await getPDAPublicKey([Buffer.from("userdata"), mintAuthority.toBuffer()], PROGRAM_ID);
};


const findPlayerDataAcc = (player) =>{
  const [listingDataAcc, bump] = PublicKey.findProgramAddressSync(
      [player.toBuffer(), Buffer.from("ggduck")],
      PROGRAM_ID
  );    

  return listingDataAcc
}

const findGameDataAcc = () => {
  const [assetManager] = PublicKey.findProgramAddressSync(
      [Buffer.from("ggduck")],
      PROGRAM_ID
  );
  return assetManager
}


const findGameTreasuryAcc = ()=> {
  const [assetManager, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("ggduck_wallet")],
      PROGRAM_ID
  );
  return assetManager
}


export { TOKEN_METADATA_PROGRAM_ID,
  findPlayerDataAcc, findGameDataAcc, findGameTreasuryAcc, getUserData,
  getPDAPublicKey, getMetadata, getMasterEdition };
