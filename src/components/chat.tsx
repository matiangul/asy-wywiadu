import React, { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { findPlayerByNick, Game } from '../model/game';
import { isLeader, Player } from '../model/player';
import { getMessagesQuery, postMessage } from '../store/repository';
import GuesserIcon from './guesser.icon';
import LeaderIcon from './leader.icon';
import SendIcon from './send.icon';

interface Message {
  id: string;
  nick: string;
  text: string;
}

const ChatMessage = ({
  msg: { nick, text },
  sender,
  player,
}: {
  msg: Message;
  sender: Player;
  player: Player;
}) => {
  const msgAlignment =
    sender.color === player.color ? 'col-start-2 col-end-13' : 'col-start-1 col-end-12';
  const textAlignment = sender.color === player.color ? 'text-right' : '';

  return (
    <div
      className={`${msgAlignment} bg-${sender.color} w-full text-sm py-2 px-4 shadow rounded-xl ${textAlignment}`}
    >
      <div className="break-all text-white font-bold">{text}</div>
      <div className="text-xs text-white italic">
        <span className="align-middle">{nick} </span>
        {isLeader(sender) ? <LeaderIcon color="white" /> : <GuesserIcon color="white" />}
      </div>
    </div>
  );
};

const Chat = ({ className, game, player }: { className: string; game: Game; player: Player }) => {
  const [messages] = useCollectionData<Message>(getMessagesQuery(game.name), {
    idField: 'id',
  });

  // scroll to the bottom of the chat on messages change
  const bottomOfTheChat = useRef<any>();
  useEffect(() => {
    bottomOfTheChat?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // handle sending new messages
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();

    setFormValue('');

    await postMessage(game.name, {
      text: formValue,
      nick: player.nick,
    });
  };

  return (
    <div className={`flex antialiased text-gray-800 ${className}`}>
      <div className="flex flex-row w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-lg bg-gray-100 h-full p-4">
            <div className="flex flex-col overflow-x-auto mb-4 flex-1">
              <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-y-2">
                  {messages?.length > 0 &&
                    messages.map((msg) => (
                      <ChatMessage
                        key={msg.id}
                        msg={msg}
                        sender={findPlayerByNick(game, msg.nick)}
                        player={player}
                      />
                    ))}
                  <span ref={bottomOfTheChat}></span>
                </div>
              </div>
            </div>
            <form onSubmit={sendMessage}>
              <div className="flex flex-row items-center h-16 rounded-xl w-full px-2">
                <div className="flex-grow">
                  <div className="relative w-full">
                    <input
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      type="text"
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                  </div>
                </div>
                <div className="ml-2">
                  <button
                    type="submit"
                    disabled={!formValue}
                    className={`flex items-center justify-center bg-${player.color} hover:bg-opacity-75 rounded-xl text-white px-4 py-1 h-10 flex-shrink-0`}
                  >
                    <span>Send</span>
                    <span className="ml-2">
                      <SendIcon />
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
