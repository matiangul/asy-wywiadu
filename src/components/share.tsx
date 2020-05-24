import * as Sentry from "@sentry/browser";
import { Game } from "../model/game";

interface Props {
  gameName: Game["name"];
}

function isSharingEnabled() {
  return navigator?.["share"];
}

function share(gameName: Game["name"]): void {
  navigator["share"]({
    title: "Asy Wywiadu",
    text: "Zagraj ze mną w Asy Wywiadu",
    url: `${window.location.protocol}//${window.location.host}/join?name=${gameName}`,
  }).catch((err) => Sentry.captureException(err));
}

export default ({ gameName }: Props) =>
  isSharingEnabled() ? (
    <button onClick={() => share(gameName)}>Zaproś znajomych</button>
  ) : (
    <p>
      Zaproś znajomych wysyłająć im link: <br />
      <a
        className="share"
        target="_blank"
        href={`${window.location.protocol}//${window.location.host}/join?name=${gameName}`}
      >
        {`${window.location.protocol}//${window.location.host}/join?name=${gameName}`}
      </a>
    </p>
  );
