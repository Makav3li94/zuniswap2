import React, {useState,useEffect} from "react";
import Link from "next/link";
import styles from './add.module.scss'
import Navbar1 from "../../components/navbar1/";
import contract from '../../src/contracts/mocks/ERC20Mintable.sol/ERC20Mintable.json';
import exchangeContract from '../../src/contracts/ZuniswapV2Pair.sol/ZuniswapV2Pair.json';
import factoryContracta from '../../src/contracts/ZuniswapV2Factory.sol/ZuniswapV2Factory.json';
import routerCont from '../../src/contracts/ZuniswapV2Router.sol/ZuniswapV2Router.json';
import {useMetamaskContext} from '../../context/metamask/index'
import Modal from 'react-modal';
import { ethers } from 'ethers';
import Web3 from "web3";


const pairContractAddress = "0xe4E64536f42a194c06Be831f0F196559871488f7";
const factoryContractAddress = "0x26f249CFc4d1770626d04b86CCf4c091F93010C7";
const routerContractAddress = "0xc61FA95A7821c44E4eb551Fd5B67b26A47F24A45";
const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const tokenAbi = contract.abi;
const pairAbi = exchangeContract.abi;
const factoryAbi = factoryContracta.abi;
const routerAbi = routerCont.abi



const Swap = () => {
    const {currentAccount,isMetamaskConnect,ethereumData,connectWalletHandler,tokenLists,setTokenList,poolList,setPoolList} = useMetamaskContext()
   
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modal2IsOpen, setModal2IsOpen] = useState(false);
    const [token1input, settoken1input] = useState("");
    const [token2input, settoken2input] = useState("");
    const [token1select, settoken1select] = useState(tokenLists[0]);
    const [token2select, settoken2select] = useState(tokenLists[1]);
    const [token1balance,setToken1Balance] = useState("");
    const [token2balance,setToken2Balance] = useState("");
    const [lpbalance,setLPBalance] = useState("");
    const [burnAmount,setBurnAmount] = useState(0);
    

    const handleConnect = async() => {
        connectWalletHandler()
    }
    const handleSelectFirstToken = () =>{
        setModal2IsOpen(true)
    }
    const handleSelectSecondToken = () =>{
        setModalIsOpen(true)
    }
    const handleToken1Input = (event) => {
        const newValue = event.target.value
        settoken1input(newValue)
    }

    const handleToken2Input = (event) => {
        const newValue = event.target.value
        settoken2input(newValue)
    }

    const handleBurnAmount = (event) => {
        const newValue = event.target.value
        setBurnAmount(newValue)
    }

    const handleToken1Select = (event) => {

    }

    const handleToken2Select = () => {

    }

    useEffect(() => {
        tokenBalanceHandler(token2select.symbol)
    },[])

    useEffect(() => {
        tokenBalanceHandler(token2select.symbol)
    },[token2select])

    useEffect(() => {
        settoken2input(token1input)
    },[token1input])

    useEffect(() => {
        settoken1input(token2input)
    },[token2input])

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

    function closeModal2() {
        setModal2IsOpen(false);
    }
    const handleSelectedItem = (index) => {
        // console.log(index);
        settoken2select(index)
        setModalIsOpen(false)
        tokenBalanceHandler()
    }

    const handleSelectedItem2 = (index) => {
        // console.log(index);
        settoken1select(index)
        setModal2IsOpen(false)
        tokenBalanceHandler()
    }


    const findPoll = (state) => {
        if (poolList){
            for (var i=0; i < poolList.length; i++) {
                if (poolList[i].token === state) {
                    return poolList[i].hashCode;
                }
            }
        }
    }

    const tokenBalanceHandler = async () =>{
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi, signer);
        let tk1Address
        let tk2Address
        let pairAddress = '';
        if(token1select.hashCode !== "ETH"){
             tk1Address = token1select.hashCode
             tk2Address = token2select.hashCode
            pairAddress = await factoryContract.pairs(tk1Address,tk2Address)
            if (!pairAddress) {
                throw new Error('Failed to approve pairAddress')
            }
   
            console.log(pairAddress);

        }else{
             tk2Address = token2select.hashCode
             pairAddress = await factoryContract.pairs(WETH,tk2Address)
             console.log("weth pair address : ",pairAddress); 
        }
        console.log("pair address : ",pairAddress); 
 

        const accounts = await ethereum.request({method: 'eth_accounts'});
        const account = accounts[0];
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

        console.log("bbb");
       

   
        const pairContract = new ethers.Contract(pairAddress, pairAbi, signer);
        const liquidity = await pairContract.balanceOf(account);
        const totalSupply = await pairContract.totalSupply()
        // console.log("lp is : " , Web3.utils.fromWei(liquidity.toString()));
        setToken1Balance(token1Balance)
        setToken2Balance(token2Balance)
        setLPBalance(Web3.utils.fromWei(liquidity.toString()))
        setBurnAmount(Web3.utils.fromWei(liquidity.toString()))
        console.log(Web3.utils.fromWei(totalSupply.toString()));
        // console.log(Web3.utils.fromWei(res.toString()));
        // console.log("lp",Web3.utils.fromWei(liquidity.toString()));
    }




    const handleAddLiquidity = async() => {
        console.log("ethereumData");
        console.log(ethereumData);
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const num = 1;
        const accounts = await ethereum.request({method: 'eth_accounts'});
        const account = accounts[0];
        const routerContract = new ethers.Contract(routerContractAddress, routerAbi, signer);

        if(token1select.symbol == "ETH") {
    
            const tokenContract2 = new ethers.Contract(token2select.hashCode, tokenAbi, signer);
            const tx1 = await tokenContract2.approve(routerContractAddress,Web3.utils.toWei(token2input.toString()))
            await tx1.wait();
            if (!tx1) {
                throw new Error('Failed to approve transaction')
            }
    
            let addLiq = await routerContract.addLiquidityETH(
                token2select.hashCode,
                WETH,
                Web3.utils.toWei(token2input.toString()),
                Web3.utils.toWei(num.toString()),
                Web3.utils.toWei(num.toString()),
                account,
                {value:Web3.utils.toWei(token1input.toString())}
                );
                await addLiq.wait(1);
                console.log(addLiq);
        }else{

            const tokenContract1 = new ethers.Contract(token1select.hashCode, tokenAbi, signer);
            const tx = await tokenContract1.approve(routerContractAddress,Web3.utils.toWei(token1input.toString()))
            await tx.wait();
            if (!tx) {
                throw new Error('Failed to approve transaction')
            }
    
            const tokenContract2 = new ethers.Contract(token2select.hashCode, tokenAbi, signer);
            const tx1 = await tokenContract2.approve(routerContractAddress,Web3.utils.toWei(token2input.toString()))
            await tx1.wait();
            if (!tx1) {
                throw new Error('Failed to approve transaction')
            }
    
            let addLiq = await routerContract.addLiquidity(
                token1select.hashCode,
                token2select.hashCode,
                Web3.utils.toWei(token1input.toString()),
                Web3.utils.toWei(token2input.toString()),
                Web3.utils.toWei(num.toString()),
                Web3.utils.toWei(num.toString()),
                account
                );
                await addLiq.wait(1);
                console.log(addLiq);

        }

    }

    const handleBurnLP = async () => {
        const provider = new ethers.providers.Web3Provider(ethereumData);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(factoryContractAddress, factoryAbi, signer);
        let pairAddress = '';
        let tk1Address
        let tk2Address
        if(token1select.hashCode !== "ETH"){
            tk1Address = token1select.hashCode
            tk2Address = token2select.hashCode
           pairAddress = await factoryContract.pairs(tk1Address,tk2Address)
           if (!pairAddress) {
               throw new Error('Failed to approve pairAddress')
           }
  
           console.log(pairAddress);

       }else{
            tk2Address = token2select.hashCode
            pairAddress = await factoryContract.pairs(WETH,tk2Address)
            console.log("weth pair address : ",pairAddress); 
       }

       const pairContract = new ethers.Contract(pairAddress, pairAbi, signer);

       const accounts = await ethereum.request({method: 'eth_accounts'});
       const account = accounts[0];
       const liquidity = await pairContract.balanceOf(account);

       if(Web3.utils.toWei(burnAmount.toString()) <= (Web3.utils.toWei(liquidity.toString()))){

        await pairContract.transfer(pairAddress, Web3.utils.toWei(burnAmount.toString()));

        let removeLiq = await pairContract.burn(account);
        await removeLiq.wait(1);
       }
    }

   

    return (
        <div className={styles.add_liquidity}>
            <Navbar1></Navbar1>
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-6  col-md-6 offset-md-3 col-lg-4 offset-lg-2`}>
                        <div className={styles.box_wrapp}>
                            <div className={`${styles.title_wrapp}`}>
                                <div>Pool Balance</div>
                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} >
                                        <svg viewBox="0 0 96 96" width="24px" color="text" xmlns="http://www.w3.org/2000/svg" style={{ marginRight : '8px'}}><circle cx="48" cy="48" r="48" fill="#F0B90B"></circle><path d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z" fill="white"></path></svg>
                                        <span className={styles.token_name}>{token1select.symbol}</span>
                                    </span>
                                    <span className={styles.token_balance} >Balance: {token1balance ? parseFloat(Web3.utils.fromWei(token1balance.toString())).toFixed(6) : 0}</span>
                                </div>

                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} >
                                        <svg viewBox="0 0 96 96" width="24px" color="text" xmlns="http://www.w3.org/2000/svg" style={{ marginRight : '8px'}}><circle cx="48" cy="48" r="48" fill="#F0B90B"></circle><path d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z" fill="white"></path></svg>
                                        <span className={styles.token_name}>{token2select.symbol}</span>
                                    </span>
                                    <span className={styles.token_balance} >Balance: {token2balance ? parseFloat(Web3.utils.fromWei(token2balance.toString())).toFixed(6) : 0}</span>
                                </div>
                                <div className={`${styles.input_box} d-flex justify-content-between`}>
                                </div>
                            </div>

                        </div>
                        <div className={styles.box_wrapp}>
                            <div className={`${styles.title_wrapp}`}>
                                <div>Burn LP</div>
                            </div>
                            {
                                lpbalance > 0?
                                <div>
                                    <div className={`${styles.select_box} d-flex justify-content-between`}>
                                        <span className={`${styles.token_symbol} d-flex`} >
                                            <svg viewBox="0 0 96 96" width="24px" color="text" xmlns="http://www.w3.org/2000/svg" style={{ marginRight : '8px'}}><circle cx="48" cy="48" r="48" fill="#F0B90B"></circle><path d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z" fill="white"></path></svg>
                                            <span className={styles.token_name}>Shafag LP</span>
                                        </span>
                                        <span className={styles.token_balance} >LP Balance: {lpbalance ? lpbalance : 0}</span>
                                    </div>
                                    <div onClick={handleBurnLP} className={`${styles.input_box} d-flex justify-content-between`}>
                                        <input className={`${styles.input}`} value={burnAmount} onChange={handleBurnAmount} type="text" placeholder="0.0"/>
                                        <button>BURN</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className={`${styles.select_box} d-flex justify-content-center`}>
                                        <span className={styles.token_balance} >NotFound LP</span>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>

                    <div className={`col-6  col-md-6 offset-md-3 col-lg-4 offset-lg-2`}>
                        <div className={styles.box_wrapp}>
                            <div className={`${styles.title_wrapp}`}>
                                <div>Add Liquidity</div>
                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} onClick={handleSelectFirstToken}>
                                        <svg viewBox="0 0 96 96" width="24px" color="text" xmlns="http://www.w3.org/2000/svg" style={{ marginRight : '8px'}}><circle cx="48" cy="48" r="48" fill="#F0B90B"></circle><path d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z" fill="white"></path></svg>
                                        <span className={styles.token_name}>{token1select.symbol}</span>
                                        <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                    </span>
                                    <span className={styles.token_balance} >Balance: {token1balance ? parseFloat(Web3.utils.fromWei(token1balance.toString())).toFixed(6) : 0}</span>
                                </div>
                                <div className={`${styles.input_box} d-flex justify-content-between`}>
                                    <label>
                                        <input className={`${styles.input}`} value={token1input} onChange={handleToken1Input} type="text" placeholder="0.0"/>
                                        <span  className={`${styles.max}`}>MAX</span>
                                    </label>
                                </div>
                            </div>
                            <div className={`${styles.change_wrapp}`}>
                                <span className={`d-flex align-items-center justify-content-center`}>
                                    <span className={`${styles.circle}`}>
                                        {/* <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path></svg> */}
                                        <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35a.501.501 0 00-.7 0z"></path></svg>
                                    </span>
                                </span>
                            </div>
                            <div>
                                <div className={`${styles.select_box} d-flex justify-content-between`}>
                                    <span className={`${styles.token_symbol} d-flex`} onClick={handleSelectSecondToken}>
                                        <svg viewBox="0 0 96 96" width="24px" color="text" xmlns="http://www.w3.org/2000/svg" style={{ marginRight : '8px'}}><circle cx="48" cy="48" r="48" fill="#F0B90B"></circle><path d="M30.9008 25.9057L47.8088 16.0637L64.7169 25.9057L58.5007 29.5416L47.8088 23.3355L37.117 29.5416L30.9008 25.9057ZM64.7169 38.3179L58.5007 34.682L47.8088 40.8881L37.117 34.682L30.9008 38.3179V45.5897L41.5926 51.7958V64.2079L47.8088 67.8438L54.0251 64.2079V51.7958L64.7169 45.5897V38.3179ZM64.7169 58.0018V50.7301L58.5007 54.366V61.6377L64.7169 58.0018ZM69.1305 60.572L58.4386 66.7781V74.0499L75.3467 64.2079V44.524L69.1305 48.1599V60.572ZM62.9143 32.1118L69.1305 35.7477V43.0195L75.3467 39.3836V32.1118L69.1305 28.4759L62.9143 32.1118ZM41.5926 69.411V76.6828L47.8088 80.3187L54.0251 76.6828V69.411L47.8088 73.0469L41.5926 69.411ZM30.9008 58.0018L37.117 61.6377V54.366L30.9008 50.7301V58.0018ZM41.5926 32.1118L47.8088 35.7477L54.0251 32.1118L47.8088 28.4759L41.5926 32.1118ZM26.4872 35.7477L32.7034 32.1118L26.4872 28.4759L20.271 32.1118V39.3836L26.4872 43.0195V35.7477ZM26.4872 48.1599L20.271 44.524V64.2079L37.1791 74.0499V66.7781L26.4872 60.572V48.1599Z" fill="white"></path></svg>
                                        <span className={styles.token_name}>{token2select.symbol}</span>
                                        <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                    </span>
                                    <span className={styles.token_balance} >Balance: {token2balance ? parseFloat(Web3.utils.fromWei(token2balance.toString())).toFixed(6) : 0}</span>
                                </div>
                                <div className={`${styles.input_box} d-flex justify-content-between`}>
                                    <label>
                                        <input className={`${styles.input}`} value={token2input} onChange={handleToken2Input} type="text" placeholder="0.0"/>
                                        {/* <span  className={`${styles.max}`}>MAX</span> */}
                                    </label>
                                </div>
                            </div>
                            <div className={`${styles.submit_wrapp}`}>
                               <button onClick={handleAddLiquidity}>Add Liquidity</button>
                            </div>
                        </div>
                    </div>






                </div>
            </div>


            
            <Modal
            isOpen={modal2IsOpen}
            onAfterOpen={afterOpenModal}
            // onRequestClose={closeModal}
            style={productBanner}
            contentLabel="Example Modal"
            ariaHideApp={false}
            >
            <div className={styles.wrapper}>
                <div id={styles.banner} className={`col-12 ${styles.banner}`}>
                    {
                        tokenLists.map((item,index)=>{
                            return(
                                <div onClick={() => handleSelectedItem2(item)}>
                                    <span>{item.symbol} </span>
                                    <span>{item.hashCode}</span>
                                </div>
                            )
                        })
                    }
                    <button className={`${styles.close}`} onClick={closeModal2}>بستن</button>
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
                        tokenLists.map((item,index)=>{
                            return(
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


