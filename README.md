# Solana GG Gamer Test Project

## How to run
    git clone https://github.com/Det-Tech/ggduck-game

    cd ggduck-game

    npm install

    npm start 

## How to configure

### - src/constants.js

You need to replace your smart contract address.

    export const PROGRAM_ID = new PublicKey("9iLoK3Xt7H9Se2vwJPqq2rjGGw6ndKPD6fMxLuhJQtNt");

### - public/scripts/main.js
- game start

    You need to find **_OnPointerEvent(name, e)**, We will get the game start event from this function.

    _OnPointerEvent(name, e) {
            if(localStorage.getItem("key") != "deposited"){ return; }
            
- game end

    You need to find **_OnDestroy(e)**, We will get the game end event from this function.

    _OnDestroy(e) {
            localStorage.setItem("key", "pending") 

- winner status

    You need to find **_OnNavigate**, We will get the winner event from this function.

     _OnNavigate(e) {
            const type = e["type"];
            localStorage.setItem("key", "withdraw")
            return;



