import Link from "next/link";
import React, {useState} from "react";
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import {useMetamaskContext} from '../../context/metamask/index'

const Navbar1 = () => {
    const {currentAccount,isMetamaskConnect,ethereumData,connectWalletHandler} = useMetamaskContext()
    const router = useRouter()
    let currentPath = router.pathname
    const activeMenu = (currentPath,items) => {
        let flag = false
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (!flag) {
                flag = currentPath.search(item) >= 0 ? true : false
            }
        }
        return flag
    }

    return (
        <div className={styles.swap}>

            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4`}>
                        
                        <div className={`${styles.nav_wrapp}`}>
                            {
                                !isMetamaskConnect
                                ?
                                <button onClick={connectWalletHandler}>Connect</button>
                                :
                                <button>DisConnect</button>
                            }
                        </div>

                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4`}>
                        
                        <div className={`${styles.nav_wrapp}`}>
                            <ul>
                                <li className={ activeMenu(currentPath,["/swap"]) ? styles.active :''}>
                                    <Link href={`/swap`}>
                                        <a>swap</a>
                                    </Link>
                                </li>
                                <li className={ activeMenu(currentPath,["/liquidity"]) ? styles.active :''}>
                                    <Link href={`/liquidity`}>
                                        <a>liquidity</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            


        </div>
    )


}

export default Navbar1


