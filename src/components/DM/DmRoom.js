import React,{useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import NewDm from '../Modal/DM/NewDm';
import { IoMdSend } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { StyledButton } from '../../style/styled_components/DM_Style';
import "../../style/css/DmRoom.css";
import { Mobile,PC } from "../Responsive";
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DmRoomIdAtom } from "../../state/DmAtom";
import {userNicknameAtom} from "../../state/UserAtom";
import { useWebSocket } from "../WebSocketConnection";

const DmRoom= ({ selectedChatInfo  }) => {
    const dmRoomId = useRecoilValue(DmRoomIdAtom);
    const { client, connected } = useWebSocket();
    const [message, setMessage] = useState('');     
    const [chatList, setChatList] = useState([]);   // 채팅기록
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [userData, setUserData] = useRecoilState(userNicknameAtom);
    const otherImgSrc = selectedChatInfo?.participantImgSrc;
    const otherName = selectedChatInfo?.participantName;

    const openNewCaht = () => {
        setIsNewChatOpen(true);
    };

    const handleKeyDown =(e) =>{
        if(e.key === 'Enter'){
            e.preventDefault();
            publish(message);
        }
    }
    const handleSendMessage = () =>{
        publish(message);
    };

    useEffect(() => {
            subscribe();
        return () => {
                unsubscribe();
        };
    }, [dmRoomId]);


    const subscribe = () => {
        const headers = {
            Authorization: window.localStorage.getItem('accessToken')
        };
    
        // 채팅방 구독
        client.subscribe(`/chatting/topic/room/${dmRoomId}`, ({ body}) => {
            const parsedMessage = JSON.parse(body);
            if (parsedMessage.chatType === "MESSAGE") {
                setChatList(prevChatList => [...prevChatList, parsedMessage]);
            } 
        }, headers);
    
        // 기존 채팅 내역 불러오기
        axios.get(`http://localhost:8080/room/${dmRoomId}/messages`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },

        })
        .then(response => {
            setChatList(response.data);
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
        });
    };

    const unsubscribe =()=>{
            const headers = {
                Authorization: window.localStorage.getItem('accessToken')
            };
            client.unsubscribe(`/chatting/topic/room/${dmRoomId}`, headers);
    };

    const publish = (message) => {
    if (!client|| !connected || message.trim()== '') {
        return;
    }

    client.publish({
        destination: "/chatting/pub/message",
        headers: { Authorization: window.localStorage.getItem('accessToken') },
        body: JSON.stringify({ message, roomId:`${dmRoomId}` , chatType: "MESSAGE"}),
    });

    setMessage("");
};



const isDifferentDate = (prevMessage, currentMessage) => {
    const prevDate = new Date(prevMessage.createdTime).toLocaleDateString();
    const currentDate = new Date(currentMessage.createdTime).toLocaleDateString();
    return prevDate !== currentDate;
};

const isDifferentTime = (prevMessage, currentMessage) => {
    const prevTime = formatTime(prevMessage.createdTime);
    const currentTime = formatTime(currentMessage.createdTime);
    return prevTime !== currentTime;
};

const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
};

const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours() % 12 || 12; // 12시간 형식으로 변경
    const ampm = date.getHours() < 12 ? '오전' : '오후';
    return `${ampm} ${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};




    return(
        <div>
            <PC>
                {dmRoomId !== 0 ? (
                <>
                <div className="dm-card" >

                    <div className="dm-header">
                        <Link to={`/profile/${otherName}`} style={{ textDecorationLine: "none", color: "white" }} >
                            <img className="img-avatar" src={otherImgSrc} alt="Participant Avatar" />
                            <div className='text-chat'><b> {otherName} </b></div>
                        </Link>
                    </div>

                    <div className="dm-body"  style={{ maxHeight: "auto", overflow: "auto" }}>
                        {chatList.map((chat, index) => (
                            <div key={index} className={`message-box ${chat.sender === otherName ? 'incoming' : 'outgoing'}`}>
                            {index === 0 || isDifferentDate(chatList[index - 1], chat) && (
                                <div className="message-date">
                                <div>{formatDate(chat.createdTime)}</div>
                                <div> chatType: {chat.chatType} </div>
                                </div>
                            )}
                            {chat.sender === otherName && (<img className="userimg" src={otherImgSrc} alt="User Avatar" />)}

                            <div className='message'> {chat.message}  </div>
                            {(index === chatList.length - 1 || isDifferentTime(chat, chatList[index + 1])) && (
                                <div className={`count ${chat.sender === otherName ? 'incoming' : 'outgoing'}`}>
                                    <div className="message-time">{formatTime(chat.createdTime)}</div>
                                    {chat.readCount === 0 && <div className="count">읽음</div>}
                                </div>
                            )}
                            </div>
                        ))}
                            </div>
                        
                        <div className="dm-input">
                            <input className="messageInput" type="text" required="" placeholder="메시지 입력.." 
                            value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
                            {/* <IoMdSend onClick={handleSendMessage} className="button-send"/> */}
                            <button onClick={handleSendMessage} className="button-send">send</button>
                        </div>
                    </div>
                    </>
                    ) : (
                        <div >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <AiOutlineMessage size='100' color='white' style={{ marginBottom: '20px' }} />
                                <StyledButton onClick={() => openNewCaht()} > <b> 메시지 보내기 </b> </StyledButton>
                            </div>
                        </div>
                    )}
            {isNewChatOpen && (<NewDm
                open={isNewChatOpen}
                onClose={() => {
                    setIsNewChatOpen(false);
                }}
            />)}
            
            </PC>
            <Mobile></Mobile>
        </div>
    );
}

export default DmRoom;

