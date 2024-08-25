import * as StompJs from "@stomp/stompjs";
import { useRef, useEffect, useState, createContext, useContext } from "react";

const WebSocketContext = createContext();
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketConnection = ({ children }) => {

    const client = useRef(null);
    const [ connected, setConnected ] = useState(false);
    const isLogin = window.localStorage.getItem('isLogin')=== 'true';

    useEffect(()=>{
        if(isLogin){
            connect();
        }
        return()=>{
            disconnect();
        };
    },[isLogin]);

    const connect = () => {
        client.current = new StompJs.Client({
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
                console.log('Connected! 연결성공!');
                setConnected(true);
            },
        });
        client.current.activate();

    };

    const disconnect = ()=>{

        if (client.current) {
            client.current.deactivate();
            setConnected(false);
            console.log('Disconnected, 연결끊김');
        }
    };

    return (
        <WebSocketContext.Provider value={{ client: client.current, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

