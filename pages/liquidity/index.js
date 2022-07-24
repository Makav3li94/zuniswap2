import React, {useState} from "react";
import Link from "next/link";
import styles from './index.module.scss'
import Navbar1 from "../../components/navbar1/";

const Swap = () => {
    const [token1input, settoken1input] = useState("");
    const [token2input, settoken2input] = useState("");
    const [token1select, settoken1select] = useState("");
    const [token2select, settoken2select] = useState("");

    const handleSelectFirstToken = () =>{
        console.log('hihi');
    }
    const handleToken1Input = (event) => {
        const newValue = event.target.value
        settoken1input(newValue)
    }

    const handleToken2Input = (event) => {
        const newValue = event.target.value
        settoken2input(newValue)
    }
    const handleToken1Select = (event) => {

    }

    const handleToken2Select = () => {

    }

    return (
        <div className={styles.liquidity}>
            <Navbar1></Navbar1>
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4`}>
                        <div className={styles.box_wrapp}>
                            <div className={`${styles.title_wrapp}`}>
                                <div>LIQUIDITY</div>
                            </div>
                            <div className={styles.liquidity_wrapp}>
                                <p>no liquidity</p>
                            </div>
                            <div className={`${styles.submit_wrapp}`}>
                                <Link href={`/liquidity/add/`}>
                                    <a>
                                        <button>Add Liquidity</button>
                                    </a>
                                </Link>
                               
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            
        </div>
    )

}

export default Swap


