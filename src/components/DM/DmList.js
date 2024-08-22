import React, { useState, useEffect } from 'react';
import { BiMessageEdit } from "react-icons/bi";
import { PC, Mobile } from '../Responsive';
import { ListContainer, StyledChatButton } from '../../style/styled_components/DmList_Style';
import NewDm from '../Modal/DM/NewDm';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { DmRoomIdAtom } from '../../state/DmAtom';

const DmList = ({ selectedChat, selectedChatInfo, setSelectedChatInfo }) => {
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [roomId, setRoomId] = useRecoilState(DmRoomIdAtom);
    const currentUser = window.localStorage.getItem('nickName');

    useEffect(() => {
        ChatRoomList();
    }, [roomId]);

    const ChatRoomList = async () => {
        try {
            const res = await axios.get('http://localhost:8080/rooms', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
                }
            });
            console.log("result", res)
            const allChatRooms = res.data;
            setChatRooms(allChatRooms);
        } catch (error) {
            console.error('Error chat rooms', error)
        }
    }
    

    const openNewCaht = () => {
        setIsNewChatOpen(true);
    };

    const onSelectChat = (roomId) => {
        setRoomId(roomId);

        const selectedRoomInfo = chatRooms.find(room => room.id === roomId);

        // selectedChatInfo에 필요한 정보 업데이트
        setSelectedChatInfo({
            participantImgSrc: selectedRoomInfo.participants.find(participant => participant.participantName !== currentUser)?.participantImgSrc,
            participantName: selectedRoomInfo.participants.find(participant => participant.participantName !== currentUser)?.participantName,
        });
    }


    return (
        <div>
            <PC>
                <div className='dm-list' style={{height: "96vh", borderRadius:"15px", backgroundColor: "#181818"}}>
                    <div className='list-user' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }} >
                        <h3 style={{marginLeft:'20px', marginTop:'10px'}}> {currentUser}</h3>
                        <button className='button' onClick={() => openNewCaht()} >
                            <BiMessageEdit className='' size='27' color='white' />
                        </button>
                    </div>

                    <div>
                        <p> 메세지</p>
                    </div>

                    <ListContainer as='ul'>
                        {chatRooms.map((room) => (
                            <StyledChatButton
                                key={room.id}
                                onClick={() => onSelectChat(room.id)}
                                selected={selectedChat === room.id}
                                as="li"
                            >
                                <div className='chat'>
                                    {Array.isArray(room.participants) && room.participants.length > 0 ? (
                                        <img
                                            src={room.participants.find(participant => participant.participantName !== currentUser)?.participantImgSrc}
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' , marginRight: '10px', backgroundColor:'white'}}
                                            alt="Participant Image"
                                        />
                                    ) : null}
                                    <div>
                                        <strong>
                                            {Array.isArray(room.participants) ? (
                                                room.participants
                                                    .filter(participant => participant.participantName !== currentUser)
                                                    .map(participant => participant.participantName)
                                                    .join(', ')
                                            ) : null}
                                        </strong>
                                    </div>
                                </div>
                            </StyledChatButton>
                        ))}
                    </ListContainer>
                </div>

                {isNewChatOpen && (<NewDm
                    open={isNewChatOpen}
                    onClose={() => {
                        setIsNewChatOpen(false);
                        ChatRoomList();
                    }}
                />)}
            </PC>

            <Mobile>
                <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }} >
                    <button className='button' onClick={() => openNewCaht()} >
                        <BiMessageEdit className='' size='27' color='black' />
                    </button>
                </div>

                <ListContainer as='ul'>
                    {chatRooms.map((room) => (
                        <StyledChatButton
                            key={room.id}
                            onClick={() => onSelectChat(room.id)}
                            selected={selectedChat === room.id}
                            as="li"
                        >
                            <div className='chat' >
                                <img
                                    src={room.userImage}
                                    alt={`${room.username}`}
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                            </div>
                        </StyledChatButton>
                    ))}
                </ListContainer>

                {isNewChatOpen && (<NewDm
                    open={isNewChatOpen}
                    onClose={() => {
                        setIsNewChatOpen(false);
                    }}
                />)}

            </Mobile>
        </div>

    );
};

export default DmList;

