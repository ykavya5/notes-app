import React from 'react';
import styles from './Home.module.css';
import img1 from '../assets/image-1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function Home() {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.title}>Pocket Notes</div>
                    <div className={styles.plusContainer}>
                    <span>&#43;</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.rightCont}>
                        <img src={img1} alt=" Notes-Image" />
                        <h1 className={styles.heading}>Pocket Notes</h1>
                        <p className={styles.desc}>Send and receive messages without keeping your phone online.
                            Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
                    </div>
                    <div className={styles.enc}>
                    <FontAwesomeIcon icon={faLock} /> &nbsp;&nbsp;&nbsp;<span>end-to-end encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
