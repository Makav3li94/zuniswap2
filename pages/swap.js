import React, {useState, useEffect} from "react";
import styles from './swap.module.scss'
import Navbar1 from "../components/navbar1/";
import contract from '../src/contracts/mocks/ERC20Mintable.sol/ERC20Mintable.json';
import exchangeContract from '../src/contracts/ZuniswapV2Pair.sol/ZuniswapV2Pair.json';
import libContract from '../src/contracts/ZuniswapV2Library.sol/ZuniswapV2Library.json';
import factoryContracta from '../src/contracts/ZuniswapV2Factory.sol/ZuniswapV2Factory.json';
import routerCont from '../src/contracts/ZuniswapV2Router.sol/ZuniswapV2Router.json';
import Modal from 'react-modal';
import {ethers} from 'ethers';
import Web3 from "web3";
import {useMetamaskContext} from "../context/metamask";
import {ToastContainer, toast} from 'react-toastify';

const routerContractAddress = "0xc61FA95A7821c44E4eb551Fd5B67b26A47F24A45";
const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const factoryContractAddress = "0x26f249CFc4d1770626d04b86CCf4c091F93010C7";
const libConAdd = "0x8fC00393851cAF3E64d9b85c60BDe1c4546BC647"
const tokenAbi = contract.abi;
const pairAbi = exchangeContract.abi;
const factoryAbi = factoryContracta.abi;
const routerAbi = routerCont.abi
const libAbi = libContract.abi
const Swap = () => {

    const {
        ethereumData,
        tokenLists,
        setTokenList,
        poolList,
        setPoolList
    } = useMetamaskContext()

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenTop, setModalIsOpenTop] = useState(false);
    const [token1input, settoken1input] = useState("");
    const [token2input, settoken2input] = useState("");
    const [token1select, settoken1select] = useState(tokenLists[0]);
    const [token2select, settoken2select] = useState(tokenLists[1]);
    const [token1balance, setToken1Balance] = useState("");
    const [token2balance, setToken2Balance] = useState("");
    const [bestCal, setBestCal] = useState(0);
    const [ethPoolBalance, setEthPoolBalance] = useState(0);
    const [tokenPoolBalance, setTokenPoolBalance] = useState(0);

    const findToken = (state) => {
        if (tokenLists) {
            for (var i = 0; i < tokenLists.length; i++) {
                if (tokenLists[i].symbol === state) {
                    return tokenLists[i].hashCode;
                }
            }
        }
    }

    const findPoll = (state) => {
        if (poolList) {
            for (var i = 0; i < poolList.length; i++) {
                if (poolList[i].token === state) {
                    return poolList[i].hashCode;
                }
            }
        }
    }

    const findExchangeAddress = (state) => {
        if (poolList) {
            for (var i = 0; i < poolList.length; i++) {
                if (poolList[i].token === state) {
                    return poolList[i].hashCode;
                }
            }
        }
    }
    const findTokenAddress = (state) => {
        if (tokenLists) {
            for (var i = 0; i < tokenLists.length; i++) {
                if (tokenLists[i].symbol === state) {
                    return tokenLists[i].hashCode;
                }
            }
        }
    }
    const userBalanceHandler = async (tokenSymbol, type) => {
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({method: 'eth_accounts'});
        const account = accounts[0];
        if (tokenSymbol === "ETH") {
            let ethBalance = await provider.getBalance(account);
            if (type === 1) {
                setToken1Balance(ethBalance)
            } else {
                setToken2Balance(ethBalance)
            }
        } else {
            let tokenAddress = findToken(tokenSymbol)
            console.log(tokenAddress)
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

            var tokenBalance = await tokenContract.balanceOf(account)
            if (type === 1) {
                setToken1Balance(tokenBalance)
            } else {
                setToken2Balance(tokenBalance)
            }
        }
    }


    const handleSelectFirstToken = () => {
        setModalIsOpenTop(true)
    }
    const handleSelectSecondToken = () => {
        setModalIsOpen(true)
    }

    const handleToken1Input = (event) => {
        const balanceCal = parseFloat(Web3.utils.fromWei(token1balance.toString())).toFixed(4)
        const newValue = event.target.value
        if (balanceCal >= newValue) {
            if (newValue.length > 0) {
                settoken1input(newValue)
            } else {
                settoken1input("")
                settoken2input("")
            }
        }

    }

    const handleToken2Input = (event) => {
        const balanceCal = parseFloat(Web3.utils.fromWei(token2balance.toString())).toFixed(4)
        const newValue = event.target.value
        // if (balanceCal >= newValue) {
            console.log(newValue);
        if (newValue.length > 0) {
            settoken2input(newValue)
        } else {
            settoken1input("")
            settoken2input("")
        }
    }

    useEffect(() => {
        if(token1input > 0 || token2input > 0){
            handleBestRate()
        }
        userBalanceHandler(token2select.symbol, 2)
    }, [token2select])

    useEffect(() => {
        if(token1input > 0 || token2input > 0){
            handleBestRate()
        }
        userBalanceHandler(token1select.symbol, 1)
    }, [token1select])
    useEffect(() => {
        if(token1input > 0 || token2input > 0){
            handleBestRate()
        }
    //     settoken2input(token1input*10)
    },[token1input])

    // useEffect(() => {
    //     settoken1input(token2input/10)
    // },[token2input])

    const productBanner = {
        content: {
            background: '#fff',
            border: 'none',
            top: '50%',
            left: '50%',
            right: 'auto',
            borderRadius: '16px',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '960px',
            zIndex: 900,
            overflow: "hidden",
            fontFamily: 'IRANYekan',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '36px',
            color: '#F14F4F',
            margin: '20px auto 10px',
            cursor: 'pointer',
            display: 'block',
            padding: '45px',
            // overflow: hidden,
            boxShadow: "-5px 5px 10px rgba(0, 0, 0, 0.1), 0px 0px 20px rgba(0, 0, 0, 0.25)"

        },
        button: {
            border: 'none',
            padding: '7px 50px',
            background: '#F14F4F',
            borderRadius: '31px',
            fontFamily: 'IRANYekan',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '36px',
            textAlign: 'center',
            color: '#FFFFFF',
            margin: '20px auto 10px',
            width: '220px',
            cursor: 'pointer',
            display: 'block',
        }
    };

    function openModal() {
        setModalIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function closeModalTop() {
        setModalIsOpenTop(false);
    }


    const handleSelectedItemTop = (index) => {
        if (index.symbol != token2select.symbol) {
            settoken1select(index)
            setModalIsOpenTop(false)
        } else {
            toast.error("توکن های انتخابی نمیتواند یکسان باشد")
        }

    }

    const handleSelectedItem = (index) => {
        if (index.symbol != token1select.symbol) {
            settoken2select(index)
            setModalIsOpen(false)
        } else {
            toast.error("توکن های انتخابی نمیتواند یکسان باشد")
        }
    }

    const handleBestRate = async () => {
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi, signer);
        let tk1Address
        let tk2Address
        let pairAddress 
        console.log(token1select.hashCode)
        console.log(token2select.hashCode)

        if(token1select.hashCode !== "ETH"){
            tk1Address = token1select.hashCode
            tk2Address = token2select.hashCode
           pairAddress = await factoryContract.pairs(tk1Address,tk2Address)
           if (!pairAddress) {
               throw new Error('Failed to approve pairAddress')
           }
  

       }else{
            tk2Address = token2select.hashCode
            pairAddress = await factoryContract.pairs(WETH,tk2Address)
       }
        console.log("omad to best rate");
        let tokenContract1 
        let tokenContract2
        let token1Balance 
        let token2Balance
     
        if(token1select.hashCode == "ETH"){
             tokenContract2 = new ethers.Contract(tk2Address, tokenAbi, signer);
             token1Balance = await provider.getBalance(pairAddress)
             token2Balance = await tokenContract2.balanceOf(pairAddress)

        }else{
             tokenContract1 = new ethers.Contract(tk1Address, tokenAbi, signer);
             token1Balance = await tokenContract1.balanceOf(pairAddress)
             tokenContract2 = new ethers.Contract(tk2Address, tokenAbi, signer);
             token2Balance = await tokenContract2.balanceOf(pairAddress)
        }
        console.log("pair:", pairAddress);
        let inputAmount = token1input
        let inputReserve = token1Balance
        let outputReserve = token2Balance

        
        let inputAmountWithFee = parseFloat(inputAmount) * 997;
        let numerator = parseFloat(inputAmountWithFee) * parseFloat(outputReserve);
        let denominator = (parseFloat(inputReserve) * 1000) + parseFloat(inputAmountWithFee);
        let bestRate = numerator / denominator;
        console.log("mohasebe best rate", bestRate);
        setBestCal(bestRate - 0.001)
        settoken2input((bestRate - 0.001).toFixed(4))
    }

    const getEthbalance = async (tokenSymbol) => {

        let address = findPoll(tokenSymbol)
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const exchangeContract = new ethers.Contract(address, exAbi, signer);
        let totalSupply = await exchangeContract.totalSupply()
        setEthPoolBalance(Web3.utils.fromWei(totalSupply.toString()))
    }
    const getTokenbalance = async (tokenSymbol) => {

        let address = findPoll(tokenSymbol)

        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const exchangeContract = new ethers.Contract(address, exAbi, signer);
        let res = await exchangeContract.getReserve();
        setTokenPoolBalance(Web3.utils.fromWei(res.toString()))
    }

    const handleSwapSubmit = async () => {
         
        if(bestCal > 0){
            const provider = new ethers.providers.Web3Provider(ethereumData);
            const signer = provider.getSigner();
            const factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi, signer);
            let tk1Address
            let tk2Address
            let pairAddress 
            if(token1select.hashCode !== "ETH"){
                tk1Address = token1select.hashCode
                tk2Address = token2select.hashCode
               pairAddress = await factoryContract.pairs(tk1Address,tk2Address)
               if (!pairAddress) {
                   throw new Error('Failed to approve pairAddress')
               }
      
    
           }else{
                tk2Address = token2select.hashCode
                pairAddress = await factoryContract.pairs(WETH,tk2Address)
           }

           const accounts = await ethereum.request({method: 'eth_accounts'});
           const account = accounts[0];
           let tokenContract1 
           let tokenContract2
           let token1Balance 
           let token2Balance
           let path = [token1select.hashCode,token2select.hashCode]
           const routerContract = new ethers.Contract(routerContractAddress, routerAbi, signer);

           if(token1select.hashCode == "ETH"){
                tokenContract2 = new ethers.Contract(tk2Address, tokenAbi, signer);
                token1Balance = await provider.getBalance(pairAddress)
                token2Balance = await tokenContract2.balanceOf(pairAddress)
   
           }else{
                tokenContract1 = new ethers.Contract(tk1Address, tokenAbi, signer);
                token1Balance = await tokenContract1.balanceOf(pairAddress)
                tokenContract2 = new ethers.Contract(tk2Address, tokenAbi, signer);
                token2Balance = await tokenContract2.balanceOf(pairAddress)

                // const libContract = new ethers.Contract(libConAdd, libAbi, signer);

                // let amount = await libContract.getAmountOut(
                //     Web3.utils.toWei(token1input.toString()),
                //     Web3.utils.toWei(token1Balance.toString()),
                //     Web3.utils.toWei(token2Balance.toString())
                // );
                // console.log("bestCal: ", bestCal);
                // console.log("amount: ",Web3.utils.toWei(amount.toString()));

                const tx1 = await tokenContract1.approve(routerContractAddress,Web3.utils.toWei(token1input.toString()))
                await tx1.wait();
                if (!tx1) {
                    throw new Error('Failed to approve transaction')
                }
                console.log(token1input.toString());
                console.log(bestCal.toString());


                let num = 0.5;
                let swap = await routerContract.swapExactTokensForTokens(
                    Web3.utils.toWei(token1input.toString()),
                    Web3.utils.toWei(num.toString()),
                    path,
                    account
                );
                await swap.wait(1);
                console.log(swap)
                if (!swap) {
                    throw new Error('Failed to Swap')
                }
           }

        }else{
            console.log("mojodi na kafi");
        }
    }

    const handleSetMax = () => {
        const balanceCal = parseFloat(Web3.utils.fromWei(token1balance.toString())).toFixed(4)
        settoken1input(balanceCal)
    }

    return (
        <div className={styles.swap}>
            <Navbar1></Navbar1>
            <ToastContainer/>
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4`}>
                        <div className={styles.box_wrapp}>
                            <div className={`${styles.title_wrapp}`}>
                                <div>SWAP</div>
                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} onClick={handleSelectFirstToken}>
                                        <svg viewBox="0 0 96 96" width="24px" color="text"
                                             xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}><circle
                                            cx="48" cy="48" r="48" fill="#F0B90B"></circle><path
                                            d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z"
                                            fill="white"></path></svg>
                                        <span className={styles.token_name}>{token1select.symbol}</span>
                                        <svg viewBox="0 0 24 24" color="text" width="20px"
                                             xmlns="http://www.w3.org/2000/svg"><path
                                            d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                    </span>
                                    <span
                                        className={styles.token_balance}>Balance: {token1balance ? parseFloat(Web3.utils.fromWei(token1balance.toString())).toFixed(4) : 0}</span>
                                </div>
                                <div className={`${styles.input_box} d-flex justify-content-between`}>
                                    <label>
                                        <input className={`${styles.input}`} value={token1input}
                                               onChange={handleToken1Input} type="text" placeholder="0.0"/>
                                        <span onClick={handleSetMax} className={`${styles.max}`}>MAX</span>
                                    </label>
                                </div>
                            </div>
                            <div className={`${styles.change_wrapp}`}>
                                <span className={`d-flex align-items-center justify-content-center`}>
                                    <span className={`${styles.circle}`}>
                                        {/* <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path></svg> */}
                                        <svg viewBox="0 0 24 24" color="primary" width="20px"
                                             xmlns="http://www.w3.org/2000/svg"><path
                                            d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35a.501.501 0 00-.7 0z"></path></svg>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} onClick={handleSelectSecondToken}>
                                        <svg viewBox="0 0 96 96" width="24px" color="text"
                                             xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}><circle
                                            cx="48" cy="48" r="48" fill="#F0B90B"></circle><path
                                            d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z"
                                            fill="white"></path></svg>
                                        <span className={styles.token_name}>{token2select.symbol}</span>
                                        <svg viewBox="0 0 24 24" color="text" width="20px"
                                             xmlns="http://www.w3.org/2000/svg"><path
                                            d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                    </span>
                                    <span
                                        className={styles.token_balance}>Balance: {token2balance ? parseFloat(Web3.utils.fromWei(token2balance.toString())).toFixed(4) : 0}</span>
                                </div>
                                <div className={`${styles.input_box} d-flex justify-content-between`}>
                                    <label>
                                        <input className={`${styles.input}`} value={token2input}
                                               onChange={handleToken2Input} type="text" placeholder="0.0" disabled />
                                        {/* <span  className={`${styles.max}`}>MAX</span> */}
                                    </label>
                                </div>
                            </div>

                            {
                                bestCal > 0 ?
                                        <div className={`${styles.gas_wrapp}`}>
                                            <div className={`${styles.gas_box}`}>
                                                <span>Best rate : </span>
                                                <span>{bestCal}</span>
                                            </div>
                                        </div>
                                    :
                                    ""
                                    
                            }
                                <div onClick={handleSwapSubmit} className={`${styles.submit_wrapp}`}>
                                    <button>SWAP</button>
                                </div>

                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpenTop}
                onAfterOpen={afterOpenModal}
                // onRequestClose={closeModal}
                style={productBanner}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div className={styles.wrapper}>
                    <div id={styles.banner} className={`col-12 ${styles.banner}`}>
                        {
                            tokenLists.map((item, index) => {
                                return (
                                    <div onClick={() => handleSelectedItemTop(item)}>
                                        <span>{item.symbol} </span>
                                        <span>{item.hashCode}</span>
                                    </div>
                                )
                            })
                        }
                        <button className={`${styles.close}`} onClick={closeModalTop}>بستن</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                // onRequestClose={closeModal}
                style={productBanner}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <div className={styles.wrapper}>
                    <div id={styles.banner} className={`col-12 ${styles.banner}`}>
                        {
                            tokenLists.map((item, index) => {
                                return (
                                    <div onClick={() => handleSelectedItem(item)}>
                                        <span>{item.symbol} </span>
                                        <span>{item.hashCode}</span>
                                    </div>
                                )
                            })
                        }
                        <button className={`${styles.close}`} onClick={closeModal}>بستن</button>
                    </div>
                </div>
            </Modal>

        </div>
    )


}

export default Swap


