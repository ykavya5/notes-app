import React, { useState, useEffect, useRef } from 'react';

import styles from './Home.module.css';
import img1 from '../assets/image-1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateGroup = () => {
        setIsPopupOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (groupName.trim() && selectedColor) {
            const initials = groupName.split(' ')
                .filter(word => word)
                .map(word => word[0].toUpperCase())
                .join('');
            setGroups([...groups, { name: groupName, color: selectedColor, initials }]);
            setIsPopupOpen(false);
            setGroupName('');
            setSelectedColor('');
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.title}>Pocket Notes</div>
                    <div className={styles.groupList}>
                        {groups.map((group, index) => (
                            <div key={index} className={styles.groupItem}>
                                <div
                                    className={styles.groupIcon}
                                    style={{ backgroundColor: `var(--${group.color})` }}
                                >
                                    {group.initials}
                                </div>
                                <span className={styles.groupName}>{group.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.plusContainer} onClick={handleCreateGroup}>
                        <span>&#43;</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.rightCont}>
                        <img src={img1} alt="Notes-Image" />
                        <h1 className={styles.heading}>Pocket Notes</h1>
                        <p className={styles.desc}>Send and receive messages without keeping your phone online.
                            Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
                    </div>
                    <div className={styles.enc}>
                        <FontAwesomeIcon icon={faLock} /> &nbsp;&nbsp;&nbsp;<span>end-to-end encrypted</span>
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <div className={styles.popup} ref={popupRef}>
                    <h2>Create New Group</h2>
                    <form onSubmit={handleFormSubmit}>
                        <label>
                            Group Name:
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </label><br />
                        <label>Choose Color:</label>
                        <div className={styles.colorOptions}>
                            {['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map(color => (
                                <div
                                    key={color}
                                    className={`${styles.colorCircle} ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: `var(--${color})` }}
                                    onClick={() => handleColorClick(color)}
                                ></div>
                            ))}
                        </div>
                        <br />
                        <button type="submit">Create</button>
                    </form>
                </div>
            )}

        </div>
    );
}

export default Home;
