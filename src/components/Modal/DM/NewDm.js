import React, { useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ModalContainer from '../Config/ModalContainer';
import { PC,Mobile } from '../../Responsive';
import { Contents, ModalWrap, Overlay, Button } from '../../../style/styled_components/PostModal_Style';
import useOutSideClick from '../../../hooks/useOutSideClick';
import { CloseButton } from 'react-bootstrap';
import axios from 'axios';
import { GrResume } from 'react-icons/gr';
import DmRoom from '../../DM/DmRoom';

function NewDm({ onClose }){
    const currentUser = window.localStorage.getItem('nickName');
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [nickname, setNickname] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [selectedUser,setSelectedUser]= useState(null);
    const [ followingUser, setFollowingUser] = useState()
    const [dmRoomId , setDmroomId]= useState('');
    const [dmListRoomId, setDmListRoomdId]= useState('');
    const handleClose = () => {
        onClose?.();
    }
    // const goDmRoom = 
    
    // useEffect (()=>{
    //     axios.get(`http://localhost:8080/api/follow/followInfo`,{
    //         headers:{
    //             'Content-Type': `application/json`,
    //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //             'ngrok-skip-browser-warning': '69420',
    //         },
    //     })
    //         .then((response)=>{
    //             setFollowingUser(response.data);
    //         })
    //         .catch((error)=>{
    //             console.error("팔로잉 api 요청 중 오류 발생", error);
    //         });
    // },[]);

    const handleSearch = async ()=>{
        try{
            const res= await axios.get('http://localhost:8080/api/search/users/nickname',{
                params: {
                    nickname: nickname,
                },
                headers:{
                    'ngrok-skip-browser-warning': '69420' 
                }
            });
            console.log("유저검색결과", res.data);
            setUserInfo(res.data);
        }catch(error){
            console.error("검색 중 오류 발생", error);
        }
    };
    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleNewChatRoom = async () => {
        try {
            const existingRooms = await axios.get('http://localhost:8080/rooms', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'ngrok-skip-browser-warning': '69420',
                },
            });
    
            const existingRoom = existingRooms.data.find(room => {
                return room.participants.some(participant => participant.participantName === selectedUser.nick_name);
            });
    
            if (existingRoom) {
                console.log("이미 있는 방:", existingRoom);
                setDmroomId(existingRoom.id);
                handleClose();
                navigate(`/dm/${existingRoom.id}`)
                // setDmListRoomdId(roomId);
            } else {

                const newRoom = await axios.post('http://localhost:8080/create-room', null, {
                    params: {
                        nickname: selectedUser.nick_name
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'ngrok-skip-browser-warning': '69420',
                    }
                });
    
                console.log("새로운 채팅방 생성 결과:", newRoom.data);
                setDmroomId(newRoom.data.id);
                handleClose();
                navigate(`/dm/${newRoom.data.id}`)
            }
        } catch (error) {
            console.error("채팅방 확인 또는 생성 중 오류 발생:", error);
        }
    };
    useEffect(() => {
        if (dmRoomId) {
            navigate(`/dm/${dmRoomId}`);
        }
    }, [dmRoomId, navigate]);


    const handleKeyPress = (e)=>{
        if(e.key === 'Enter'){
            handleSearch();
        }
    };

    useOutSideClick(modalRef, handleClose)

    return(
        <div>
            <PC>
                <ModalContainer>
                    <Overlay>
                        <ModalWrap ref={modalRef}>
                            <Contents>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <h5><b> 새로운 메시지 </b></h5>
                                    <CloseButton class="btn-close btn-close-white" aria-label="Close"  onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', color: '#333' }}></CloseButton>
                                </div>

                                <hr/>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <span><b> 받는사람: </b></span>
                                    <div style={{ width: '10px' }}></div> 
                                    <input type='text' className="form-control" style={{ width: "80%" }}  placeholder='검색...' onChange={(e) => setNickname(e.target.value)} onKeyDown={handleKeyPress} />
                                    <button class="btn btn-outline-success" onClick={handleSearch}  >Search</button>
                                </div>
                                <div>
                                    {selectedUser && (
                                        <div>
                                            <img src={selectedUser.user_img_src} alt={selectedUser.nick_name} style={{ width:'30px', height:'30px', borderRadius:'50%', marginRight:'5%',marginTop:'5%' }} />
                                            <span>{selectedUser.nick_name}</span>
                                        </div>
                                    )}
                                </div>
                                <hr/>
                                
                                <div> 
                                    {/* <ul>
                                        {userInfo &&
                                            userInfo.map((result) =>(
                                                <div key={result.id}>
                                                    <p><img src={userInfo.img_src} alt={userInfo.nick_name}/>{userInfo.nick_name} </p>
                                                </div>
                                            ))}
                                    </ul> */}
                                    {/* <div className="following-list">
                                        {followingUser && followingUser.followingNickNames && followingUser.followingNickNames.map((username, index) => (
                                            <div key={index} className="user-item" onClick={() => handleUserClick(username)} >
                                                <p>{username}</p>
                                            </div>
                                        ))}
                                    </div> */}

                                    <div>
                                        {userInfo && userInfo.map((user) => (
                                            <div key={user.id} onClick={() => handleUserClick(user)}
                                            style={{
                                                cursor: 'pointer',
                                                marginBottom: '10px', // 리스트 항목 간격 조절
                                                backgroundColor: selectedUser === user ? '#EAEAEA' : 'transparent',
                                                transition: 'background-color 0.3s ease', // 호버 효과를 부드럽게 만듭니다.
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#121212'; // 호버 시 배경색 변경
                                            }}
                                                onMouseLeave={(e) => {
                                                if (selectedUser !== user) {
                                                    e.currentTarget.style.backgroundColor = 'transparent'; // 호버 종료 시 배경색 원래대로
                                                }
                                            }}>
                                                <img src={user.user_img_src} alt={user.nick_name} style={userImageStyle} />
                                                <span>{user.nick_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                

                                <div className='justify-content-center'>
                                    <Button onClick={handleNewChatRoom}> 채팅 </Button>
                                </div>
                            </Contents>
                        </ModalWrap>
                    </Overlay>
                </ModalContainer>
            </PC>

        </div>
    );
}

export default NewDm;



const userContainerStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const userImageStyle = {
    width: '8%',
    height: '8%',
    borderRadius: '50%',
    margin: '5%',
    backgroundColor: 'white'

};
