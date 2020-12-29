import * as Sentry from '@sentry/browser';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Game } from '../model/game';

interface Props {
  gameName: Game['name'];
  disabled: boolean;
}

function isSharingEnabled() {
  return typeof navigator !== 'undefined' && navigator?.['share'];
}

function share(gameName: Game['name']): void {
  navigator['share']({
    title: 'Asy Wywiadu',
    text: 'Zagraj ze mną w Asy Wywiadu',
    url: `${window.location.protocol}//${window.location.host}/join?name=${gameName}`,
  }).catch((err) => Sentry.captureException(err));
}

const Share = ({ gameName, disabled }: Props) => {
  if (isSharingEnabled()) {
    return (
      <button
        disabled={disabled}
        className="w-full mt-2 bg-pink-500 hover:bg-pink-400 text-white py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded"
        onClick={() => share(gameName)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="inline w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="align-text-top">&nbsp;&nbsp;Zaproś znajomych</span>
      </button>
    );
  } else {
    const [copyAlertShown, setCopyAlertShown] = useState(false);
    const showAnAlert = () => {
      setCopyAlertShown(true);
      setTimeout(() => setCopyAlertShown(false), 600);
    };
    const text =
      typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}/join?name=${gameName}`
        : '';

    return (
      <>
        <p>Zaproś znajomych kopiując i wysyłająć im link:</p>
        <CopyToClipboard text={text} onCopy={showAnAlert}>
          <button
            disabled={disabled}
            className="w-full mt-2 bg-pink-500 hover:bg-pink-400 text-white py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="inline w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span className="align-text-top"> Skopiuj</span>
          </button>
        </CopyToClipboard>
        <div
          className={`${
            copyAlertShown ? 'block' : 'hidden'
          } bg-gray-200 rounded mt-2 text-teal-900 px-4 py-3 shadow-md`}
          role="alert"
        >
          <div className="flex flex-row">
            <svg
              className="fill-current h-6 w-6 text-teal-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
              />
            </svg>
            <p className="">Skopiowano</p>
          </div>
        </div>
      </>
    );
  }
};

export default Share;
