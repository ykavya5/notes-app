import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import img1 from '../assets/image-1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import SendIcon from '@mui/icons-material/Send';

function Home() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    // Load groups and notes from localStorage when the component mounts
    useEffect(() => {
        const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
        setGroups(savedGroups);

        if (savedGroups.length > 0) {
            const savedMessages = JSON.parse(localStorage.getItem(savedGroups[0].name)) || [];
            setMessages(savedMessages);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleCreateGroup = () => {
        setIsPopupOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (groupName.trim() && selectedColor) {
            // Split the groupName into words and filter out empty strings
            const words = groupName.split(' ').filter(word => word);
    
            let initials = '';
    
            // If there are more than 2 words, get the first letter of the first and last words
            if (words.length > 2) {
                initials = words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
            } else {
                // Otherwise, get the first letter of each word
                initials = words.map(word => word[0].toUpperCase()).join('');
            }
    
            const newGroup = { name: groupName, color: selectedColor, initials };
    
            // Save the group to the state and localStorage
            const updatedGroups = [...groups, newGroup];
            setGroups(updatedGroups);
            localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
            setIsPopupOpen(false);
            setGroupName('');
            setSelectedColor('');
        }
    };
    

    const handleGroupClick = (group) => {
        setSelectedGroup(group);

        // Fetch messages related to the selected group from localStorage
        const groupMessages = JSON.parse(localStorage.getItem(group.name)) || [];
        setMessages(groupMessages);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const formattedTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).replace('am', 'AM').replace('pm', 'PM');
            const newMessage = {
                text: messageInput,
                dateTime: { date: formattedDate, time: formattedTime } // Store date and time separately
            };

            // Save the new message to the state and localStorage
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            localStorage.setItem(selectedGroup.name, JSON.stringify(updatedMessages));

            setMessageInput(''); // Clear the input field
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter key is pressed without Shift key
            e.preventDefault(); // Prevent new line from being added
            handleSendMessage(e); // Call the send message function
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.title}>Pocket Notes</div>
                    <div className={styles.groupList}>
                        {groups.map((group, index) => (
                            <div key={index} className={styles.groupItem} onClick={() => handleGroupClick(group)}>
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
                    {selectedGroup ? (
                        <div className={styles.chatContainer}>
                            <div className={styles.chatHeader}>
                                <div
                                    className={styles.chatGroupIcon}
                                    style={{ backgroundColor: `var(--${selectedGroup.color})` }}
                                >
                                    {selectedGroup.initials}
                                </div>
                                <span className={styles.chatGroupName}>{selectedGroup.name}</span>
                            </div>
                            <div className={styles.messagesContainer}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={styles.messageItem}>
                                        <span className={styles.messageText}>{msg.text}</span>
                                        <span className={styles.messageDateTime}>
                                            <span>{msg.dateTime.date}</span>
                                            <span className={styles.dot}>  </span>
                                            <span>{msg.dateTime.time}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Enter your text here..........."
                                    className={styles.messageInput}
                                    rows="5" // Set the number of visible text lines
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                                <button type="submit" className={styles.sendButton} disabled={!messageInput.trim()}>
                                    <SendIcon />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
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
                    )}
                </div>
            </div>
            {isPopupOpen && (
                <div className={styles.popup} ref={popupRef}>
                    <h2>Create New Group</h2>
                    <form onSubmit={handleFormSubmit}>
                        <label className={styles.grpName}>
                            Group Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                placeholder=' &nbsp;&nbsp;&nbsp;Enter group name'
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </label>
                        
                        <div className={styles.colorSelectorContainer}>
                            <label className={styles.grpName}>Choose Color</label>
                            <div className={styles.colorOptions}>
                                {['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map(color => (
                                    <div
                                        key={color}
                                        className={`${styles.colorCircle} ${selectedColor === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: `var(--${color})` }}
                                        onClick={() => handleColorClick(color)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <br />
                        <button className={styles.create} type="submit">Create</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Home;
