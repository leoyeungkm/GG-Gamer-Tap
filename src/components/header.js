import React, { useEffect, useState } from "react";
import { withRouter, NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import logo from "../img/egg.png";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    initialize,
    adminDeposit,
    adminWithdraw,
    userDeposit,
    userWithdraw,
} from "./../api";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Modal from "react-bootstrap4-modal";
import { toast } from "react-toastify";
import sfd from "../img/sfd.png";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const wallet = useWallet();
    const { connection } = useConnection();
    const [depositModal, setDepositModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [clicked, setClicked] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawActive, setWithdrawActive] = useState(false);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (wallet?.publicKey) {
            connection.getBalance(wallet?.publicKey).then((data) => {
                console.log("balance", (data / LAMPORTS_PER_SOL).toFixed(2));
                setBalance((data / LAMPORTS_PER_SOL).toFixed(2));
            });
        }
    }, [wallet?.publicKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (localStorage.getItem("key") == "deposited") {
                setClicked(false);
            } else {
                setClicked(true);
            }
            if(localStorage.getItem("key") == "withdraw") {
                setWithdrawActive(true);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const depositHandler = async (amount) => {
        if (!wallet?.publicKey) {
            toast.info("Connect Wallet!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }

        if (amount <= 0) {
            toast.info("Please set amount", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }

        const id = toast.loading("Waiting deposit...", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });

        const res = await userDeposit(connection, wallet, amount);

        if (res?.success) {
            localStorage.setItem("key", "deposited");
            setWithdrawAmount(amount*1.9.toFixed(2))
        }

        toast.update(id, {
            render: res.success ? "Successfully deposited" : "Error",
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
    };

    const withdrawHandler = async () => {
        if (!wallet?.publicKey) {
            toast.info("Connect Wallet!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }

        if (localStorage.getItem("key") != "withdraw") {
            toast.info("You can't withdraw!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return;
        }

        const id = toast.loading("Waiting withdraw...", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });

        const res = await userWithdraw(connection, wallet);

        if (res?.success) {
            localStorage.setItem("key", "pending");
            setWithdrawAmount(0);
            setWithdrawActive(false)
        }

        toast.update(id, {
            render: res.success ? "Successfully withdraw" : "Error",
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
    };

    return (
        <div
            className={`container-fliud sticky-top${menuOpen ? " open" : ""}`}
            id="header"
        >
            <div className="row mx-0">
                <div className="container-fluid py-2">
                    <div className="row d-flex flex-wrap align-items-center justify-content-center">
                        <div className="col-8 col-md-3 col-lg-2 py-2">
                            <NavLink
                                exact={true}
                                activeClassName="active"
                                to="/"
                                className="d-flex align-items-center link"
                            >
                                <img
                                    src={logo}
                                    alt=""
                                    id="icon"
                                    className="circle"
                                />
                                <h4 className="d-inline-block mb-0 pl-2">
                                    {process.env.REACT_APP_TITLE}
                                </h4>
                            </NavLink>
                        </div>
                        <div className="col-4 d-md-none text-right py-2">
                            <span id="toggleMenu" onClick={() => toggleMenu()}>
                                <FontAwesomeIcon icon={faChevronCircleDown} />
                            </span>
                        </div>
                        <div
                            tabIndex="0"
                            onBlur={() => setMenuOpen(false)}
                            className="col-12 col-md-9 col-lg-10 d-flex flex-wrap align-items-center justify-content-center justify-content-md-end navMenu"
                            id="nav"
                        >
                            <div>Amount : {balance}</div>
                            <div className="col-4">
                                <button
                                    className="btn btn-lg btn-outline-secondary w-100"
                                    onClick={() => {
                                        setDepositModal(true);
                                    }}
                                >
                                    Deposit
                                </button>
                            </div>
                            <div className="col-4">
                                <button
                                    className="btn btn-lg btn-outline-primary w-100"
                                    onClick={() => {
                                        withdrawHandler();
                                    }}
                                >
                                    {withdrawAmount>0?`If you pass it, win ${withdrawAmount}Sol`:!withdrawActive?"GG":""}
                                    {withdrawActive?<> You Won! Withdraw <span style={{color:"red"}}>{withdrawAmount}</span></>:""}
                                </button>
                            </div>
                            <NavLink
                                exact={true}
                                activeClassName="active"
                                to="/"
                            >
                                <span
                                    className="mx-1 p-2 d-block"
                                    onClick={() => {
                                        setInfoModal(true);
                                    }}
                                >
                                    Info
                                </span>
                            </NavLink>
                            <WalletMultiButton />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                visible={depositModal}
                onClickBackdrop={() => {
                    setDepositModal(false);
                }}
            >
                <div className="modal-header">
                    <h5 className="modal-title">Deposit</h5>
                </div>
                <div className="modal-body">
                    <p>To play the game, should deposit sol</p>
                    <div
                        className="row d-flex flex-wrap align-items-center justify-content-center"
                        style={{ gap: "5px" }}
                    >
                        <div className="col-4">
                            <button
                                className="btn btn-lg btn-outline-primary w-100"
                                onClick={() => {
                                    depositHandler(0.01);
                                    setDepositModal(false);
                                }}
                            >
                                0.01 SOL
                            </button>
                        </div>
                        <div className="col-4">
                            <button
                                className="btn btn-lg btn-outline-primary w-100"
                                onClick={() => {
                                    depositHandler(0.1);
                                    setDepositModal(false);
                                }}
                            >
                                0.1 SOL
                            </button>
                        </div>
                        <div className="col-4">
                            <button
                                className="btn btn-lg btn-outline-primary w-100"
                                onClick={() => {
                                    depositHandler(1);
                                    setDepositModal(false);
                                }}
                            >
                                1 SOL
                            </button>
                        </div>
                        <div className="col-4">
                            <button
                                className="btn btn-lg btn-outline-primary w-100"
                                onClick={() => {
                                    depositHandler(5);
                                    setDepositModal(false);
                                }}
                            >
                                5 SOL
                            </button>
                        </div>
                        <div className="col-4">
                            <button
                                className="btn btn-lg btn-outline-primary w-100"
                                onClick={() => {
                                    depositHandler(10);
                                    setDepositModal(false);
                                }}
                            >
                                10 SOL
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-footer"></div>
            </Modal>

            <Modal
                visible={infoModal}
                onClickBackdrop={() => {
                    setInfoModal(false);
                }}
            >
                <div className="modal-header">
                    <h5 className="modal-title">GGDUCK</h5>
                </div>
                <div className="modal-body">
                    <div className="col-12 col-md-10 col-lg-8 mx-auto my-4">
                        <h1 className="text-center mb-4">Info of GGDUCK</h1>
                        <br />
                        <br />
                        <p>
                            <img
                                src={sfd}
                                alt=""
                                className="d-block mx-auto circle historyImage"
                            />
                            <br />
                            <br />
                            The info of GGDuck game on solana
                            <br />
                            <br />
                            <a
                                href={`#`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                            >
                                GGDUCK{" "}
                                <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    className="pl-1 external"
                                />
                            </a>
                            <br />
                            <br />
                            Thanks for playing
                            <br />
                            <br />
                        </p>
                    </div>
                </div>
            </Modal>

            {clicked && (
                <button
                    className="btn btn-lg btn-outline-success w-100"
                    onClick={async () => {}}
                >
                    To play the game, Please Deposit!
                </button>
            )}
        </div>
    );
}

export default withRouter(Header);
