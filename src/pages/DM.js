import React, { useState, useEffect} from 'react';
import DmList from '../components/DM/DmList';
import DmRoom from '../components/DM/DmRoom';
import NewDm from '../components/Modal/DM/NewDm';
import { Mobile, PC } from '../components/Responsive';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { DmRoomIdAtom } from '../state/DmAtom';
import MiniNavbar from '../components/Navigation/MiniNavbar';
import MiniPlayer from '../components/Player/MiniPlayer';
import { useNavigate } from 'react-router-dom';
import { useWebSocket, WebSocketConnection } from '../components/WebSocketConnection';
import { AiOutlineMessage } from "react-icons/ai";
import { StyledButton } from '../style/styled_components/DM_Style';
import '../style/css/DmRoom.css';


function DM() {
    const { connected } = useWebSocket();
    const dmRoomId  = useRecoilValue(DmRoomIdAtom);
    const resetDmRoomId = useResetRecoilState(DmRoomIdAtom);
    const [selectedChatInfo, setSelectedChatInfo] = useState(null);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (dmRoomId && dmRoomId !== "0") {
            navigate(`/dm/${dmRoomId}`);
        }
    }, [dmRoomId, navigate]);

    useEffect(()=>{
        return() =>{
            resetDmRoomId();
        };
    },[resetDmRoomId]);

    const openNewCaht = () => {
        setIsNewChatOpen(true);
    };

    return (
        <WebSocketConnection>
            <div>
                <PC>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0px', }}>
                        <div className='col-md-1'><MiniNavbar/></div>
                        <div className='col-md-2' >
                            <DmList setSelectedChatInfo={setSelectedChatInfo}  selectedChatInfo={selectedChatInfo} />
                        </div>
                        <div className='col-md-7'>
                        {connected ? (
                            dmRoomId && dmRoomId !== "0" ? (
                                <DmRoom selectedChatInfo={selectedChatInfo} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <AiOutlineMessage size='100' color='white' style={{ marginBottom: '20px' }} />
                                    <div style={{ marginBottom: '3%' }}><b> 내 메세지 </b></div>
                                    <StyledButton onClick={() => openNewCaht()}><b> 메시지 보내기 </b></StyledButton>
                                </div>
                            )
                        ) : (
                            <div>Connecting...</div>
                        )}
                        </div>

                        <div className='col-md-2'>
                            <MiniPlayer />
                        </div>

                    {isNewChatOpen && (<NewDm
                        open={isNewChatOpen}
                        onClose={() => {
                            setIsNewChatOpen(false);
                        }}
                    />)}    
                    </div>
                </PC>
                <Mobile></Mobile>
            </div>
        </WebSocketConnection>
        
    );
}

export default DM;