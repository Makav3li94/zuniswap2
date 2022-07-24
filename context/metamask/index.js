import {createContext, useContext, useState, useEffect} from 'react';

const MetamaskContext = createContext();
export const MetamaskProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [isMetamaskConnect, setIsMetamaskConnect] = useState(false);
    const [ethereumData, setEthereumData] = useState(null);

    const [tokenLists, setTokenList] = useState(
        [
            {symbol: "ETH", hashCode: ""},
            {symbol: "HAM", hashCode: "0x9636109d8E670d4A7E8688cAE56F43795498E3e3"},
            {symbol: "SHC", hashCode: "0xF74b19DC6c8327C84Ee5F56f0C1D55E532E2B0Fc"},
            {symbol: "MOH", hashCode: "0x4B1756c67D69e3f3Dc494723109f46798613bcc9"},
            {symbol: "WETH", hashCode: "0xc778417E063141139Fce010982780140Aa0cD5Ab"},
            {symbol: "TK1", hashCode: "0x35C1C2d00135F149e78b814f1960B1c8C55E3A65"},
            {symbol: "TK2", hashCode: "0xaDb92B7AA20811708310cF8cdA91F880d7b49fC8"},
            {symbol: "TK3", hashCode: "0xB26E2f51496F33fEF58eF490381662645B914CD9"},
            {symbol: "TK4", hashCode: "0x425BECa4A961567e37814F14974D6aAF6632Ba00"},
            {symbol: "TK5", hashCode: "0x8510012c2dAc13C212569F9Fef753661413eD70e"},
            {symbol: "TK6", hashCode: "0xFc76290436F9dAd32e9F02b828B91B1BF369C722"},
            // {symbol: "PAS", hashCode: "0x4d8D1584dAd195058578acECb490e6997Ffe9ddB"}
        ]
    );

    const [poolList, setPoolList] = useState(
        [
            {token: "ETH", hashCode: ""},
            {token: "SHC", hashCode: "0x8341c3edc965bf010de3646c9ef939c4c4f71044"},
            {token: "HAM", hashCode: "0xa6f6665e14accfdc0cacd67220b2b0c41e010fd0"},
            {token: "MOH", hashCode: "0x70c834db77ed59bd3b1af65cb161444afb00c495"},

            // {token: "PAS", hashCode: "0x9Af4ce0E0c442aaDF8EaeAC44d83F5341E4C25C7"},
        ]
    );

    const fetchEthereum = async () => {
        const {ethereum} = window;
        if (ethereum && !ethereumData) {
            setEthereumData(ethereum)
        }
    }
    fetchEthereum()
    const checkWalletIsConnected = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        } else {
            console.log("Wallet exists! We're ready to go!")
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
            setIsMetamaskConnect(true)
        } else {
            setIsMetamaskConnect(false)
            console.log("No authorized account found");
        }
    }

    checkWalletIsConnected()

    const connectWalletHandler = async () => {
        const {ethereum} = window;
        if (!ethereum) {
            alert("Please install Metamask!");
        }

        try {
            if (!isMetamaskConnect) {
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                console.log("Found an account! Address: ", accounts[0]);
                setCurrentAccount(accounts[0]);
                setIsMetamaskConnect(true)
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <MetamaskContext.Provider
            value={{
                currentAccount, isMetamaskConnect,
                ethereumData, connectWalletHandler,
                tokenLists, setTokenList,
                poolList, setPoolList
            }}
        >
            {children}
        </MetamaskContext.Provider>
    );
}

export const useMetamaskContext = () => {
    return useContext(MetamaskContext);
}
