import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Connection,
} from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import * as utils from "./utils";

import idl from "./idl.json";

const idlData = idl;

const contractDataPublic = utils.getPDAPublicKey(
    [Buffer.from("contractdata")],
    PROGRAM_ID
);
const treasuryDataPublic = utils.getPDAPublicKey(
    [Buffer.from("treasury")],
    PROGRAM_ID
);

const getProvider = async (connection, wallet) => {
    const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        anchor.AnchorProvider.defaultOptions()
    );
    return provider;
};

// export const getFarmEventData = async (connection, wallet, handleUserDepoistedEvent) => {
//     const provider = await getProvider(connection, wallet);
//     const program = new Program(idlData, PROGRAM_ID, provider);
//     const userDepositListener = program.addEventListener(program.idl.events[5].name, handleUserDepoistedEvent);
// };

export const initialize = async (connection, wallet) => {
    try {
        console.log("initialize starting...");
        const provider = await getProvider(connection, wallet);
        const program = new Program(idlData, PROGRAM_ID, provider);
        const tx = await program.methods
            .initialize()
            .accounts({
                contractData: await contractDataPublic,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("Your initialize signature: ", tx);
        console.log("initialize finished");
        return { success: true };
    } catch (error) {
        console.log(error);
        console.log("error: initialize Skip");
        return { success: false };
    }
};

const isValidSolanaAddress = (address) => {
    try {
        PublicKey.fromString(address);
        return true;
    } catch (error) {
        return false;
    }
};

export const adminDeposit = async (connection, wallet, depositAmount) => {
    try {
        const provider = await getProvider(connection, wallet);
        let program = new Program(idlData, PROGRAM_ID, provider);

        const playerAccount = await utils.findPlayerDataAcc(
            provider.wallet.publicKey
        );
        const amount = new anchor.BN(depositAmount * LAMPORTS_PER_SOL);
        const tx = await program.methods
            .adminDeposit(amount)
            .accounts({
                player: wallet.publicKey,
                playerStateAccount: playerAccount,
                treasuryAccount: await treasuryDataPublic,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("Your adminDeposit signature: ", tx);

        return { success: true };
    } catch (err) {
        return { success: false };
    }
};

export const adminWithdraw = async (connection, wallet, withdrawAmount) => {
    try {
        const provider = await getProvider(connection, wallet);
        let program = new Program(idlData, PROGRAM_ID, provider);

        const amount = new anchor.BN(withdrawAmount * LAMPORTS_PER_SOL);
        const tx = await program.methods
            .adminWithdraw(amount)
            .accounts({
                contractData: await contractDataPublic,
                authority: wallet.publicKey,
                treasury: await treasuryDataPublic,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("Your adminWithdraw signature: ", tx);

        return { success: true };
    } catch (err) {
        return { success: false };
    }
};

export const userDeposit = async (connection, wallet, depositAmount) => {
    try {
        console.log("userDeposit starting...");
        const provider = await getProvider(connection, wallet);
        let program = new Program(idlData, PROGRAM_ID, provider);

        const playerAccount = await utils.findPlayerDataAcc(
            provider.wallet.publicKey
        );

        const amount = new anchor.BN(LAMPORTS_PER_SOL * depositAmount); // new anchor.BN(10e9); // 10 SOL
        const tx = await program.methods
            .userDeposit(amount)
            .accounts({
                player: wallet.publicKey,
                playerStateAccount: playerAccount,
                treasuryAccount: await treasuryDataPublic,
                systemProgram: SystemProgram.programId,
            })
            .rpc()

        console.log("Your userDeposit signature: ", tx);

        const playerData = await program.account?.playerState
            ?.fetch(playerAccount)
            .catch((e) => {
                return null;
            });

        console.log("playerData amount: ", playerData?.amount.toString());
        console.log("playerData count: ", playerData?.count.toString());

        return { success: true };
    } catch (err) {
        console.log(err);
        console.log("error: userDeposit Skip");
        return { success: false };
    }
};

export const userWithdraw = async (connection, wallet, nft) => {
    try {
        console.log("userWithdraw starting...");
        const provider = await getProvider(connection, wallet);
        let program = new Program(idlData, PROGRAM_ID, provider);

        const playerAccount = await utils.findPlayerDataAcc(
            provider.wallet.publicKey
        );

        const tx = await program.methods
            .userWithdraw()
            .accounts({
                playerAccount: playerAccount,
                player: wallet.publicKey,
                treasuryAccount: await treasuryDataPublic,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const playerData = await program.account?.playerState
            ?.fetch(playerAccount)
            .catch((e) => {
                return null;
            });
        console.log("Your userWithdraw signature: ", tx);
        return { success: true };
    } catch (err) {
        console.log(err.message);
        console.log("error: userWithdraw Skip");
        return { success: false };
    }
};
