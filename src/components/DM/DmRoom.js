import React,{useState, useEffect, useRef} from "react";
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
import * as StompJs from "@stomp/stompjs";

const DmRoom= ({ selectedChatInfo  }) => {
    const dmRoomId = useRecoilValue(DmRoomIdAtom);
    const client = useRef({});
    const [message, setMessage] = useState('');     
    const [chatList, setChatList] = useState([]);   // 채팅기록
    const [connected, setConnected] = useState(false);
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


    const connect = () => {
        client.current = new StompJs.Client({
            // brokerURL: 'ws://ec2-13-125-0-53.ap-northeast-2.compute.amazonaws.com:8080/ws-chat',
            brokerURL: 'ws://localhost:8080/ws-chat',
            connectHeaders: {
                Authorization: localStorage.getItem('accessToken'),
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: function (str) {
                console.log(str);
            },
            onStompError: (frame) => {
                console.error('Stomp error:', frame);
            },
            onConnect: () => {
                setConnected(true);
                subscribe();
            },
        });
        client.current.activate();
    };

    const disconnect = () => {
        if (client.current.connected) {
            client.current.deactivate();
            // setConnected(false);
            console.log('Disconnected');
        }
    };
    useEffect(() => {
        connect();

        return () => {
            unsubscribe();
            disconnect();
        }
    }, [dmRoomId]);


    const subscribe = () => {
        const headers = {
            Authorization: window.localStorage.getItem('accessToken')
        };
    
        // 채팅방 구독
        client.current.subscribe(`/chatting/topic/room/${dmRoomId}`, ({ body}) => {
            const parsedMessage = JSON.parse(body);
            if (parsedMessage.chatType === "MESSAGE") {
                setChatList(prevChatList => [...prevChatList, parsedMessage]);
            } 
        }, headers);

        //     // 신규 메시지 도착 시 처리
        //     // setChatList((_chatList) => [..._chatList, JSON.parse(body)]);
        //     setChatList(prevChatList => [...prevChatList, JSON.parse(body)]);
        // }, headers);
    
        // 기존 채팅 내역 불러오기
        axios.get(`http://localhost:8080/room/${dmRoomId}/messages?limit=25`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },

        })
        .then(response => {
            // setChatList((_chatList) => [..._chatList, ...response.data]); //방바꿀떄마다 chatList 초기화 시키기 
            setChatList(response.data);
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
        });
    };

    const unsubscribe =()=>{
        if (client.current.connected) {
            const headers = {
                Authorization: window.localStorage.getItem('accessToken')
            };

            client.current.unsubscribe(`/chatting/topic/room/${dmRoomId}`, headers);
        }
    };

    const publish = (message) => {
    if (!client.current.connected || message.trim()== '') {
        return;
    }

    client.current.publish({
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
                        <img className="img-avatar" src={otherImgSrc} alt="Participant Avatar" />
                        <div className='text-chat'><b> {otherName} </b></div>
                    </div>
                    <div className="dm-body"  style={{ maxHeight: "70vh", overflow: "auto" }}>
                        {chatList.map((chat, index) => (
                            <div key={index} className={`message-box ${chat.sender === otherName ? 'incoming' : 'outgoing'}`}>
                            {index === 0 || isDifferentDate(chatList[index - 1], chat) && (
                                <div className="message-date">
                                <div>{formatDate(chat.createdTime)}</div>
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

