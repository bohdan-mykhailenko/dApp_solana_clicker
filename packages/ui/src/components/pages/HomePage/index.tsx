import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { LeaderboardItem, anchorCLient } from "@repo/ui/anchor-client";
import { LanguageSwitcher, Leaderboard } from "@repo/ui/components";

import "@repo/tailwind/global-styles";

import "@solana/wallet-adapter-react-ui/styles.css";
import { useTranslationClient } from "@repo/ui/i18n";
import { useParams } from "next/navigation";

import { LanguageParams } from "../../types";

export const HomePage = () => {
  const { language }: LanguageParams = useParams();
  const { t } = useTranslationClient(language);
  const [clicks, setClicks] = useState(0);
  const [effect, setEffect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
  const [gameError, setGameError] = useState("");
  const [gameAccountPublicKey, setGameAccountPublicKey] = useState("");
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const [isClientSide, setIsClientSide] = useState(false);

  const { connected } = useWallet();
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallet = useAnchorWallet();

  async function handleClick() {
    setGameError("");
    if (wallet) {
      try {
        await anchorCLient.saveClick({
          wallet,
          endpoint,
          gameAccountPublicKey,
        });
        setClicks(clicks + 1);
        setEffect(true);
      } catch (e) {
        if (e instanceof Error) {
          setGameError(e.message);
        }
      }
    }
  }

  useEffect(() => {
    async function initGame() {
      if (wallet) {
        const gameState = await anchorCLient.getCurrentGame({
          wallet,
          endpoint,
        });
        setIsGameReady(connected && gameState.isReady);
        setClicks(gameState.clicks);
        setGameAccountPublicKey(gameState.gameAccountPublicKey);
        setSolanaExplorerLink(
          `https://explorer.solana.com/address/${gameAccountPublicKey}/anchor-account?cluster=${network}`
        );
        setGameError(gameState.errorMessage);
      } else {
        setIsGameReady(false);
        setClicks(0);
        setGameAccountPublicKey("");
        setSolanaExplorerLink("");
        setGameError("");
      }
    }
    setIsConnected(connected);
    initGame();
  }, [connected, endpoint, network, wallet, gameAccountPublicKey]);

  // airdrop test SOL if on devnet and player has less than 1 test SOL
  useEffect(() => {
    async function fetchTestSol(): Promise<void> {
      if (wallet) {
        try {
          await anchorCLient.airdrop({ wallet, endpoint });
        } catch (error: any) {
          throw new Error(
            `Unable to airdrop 1 test SOL due to ${error.message}`
          );
        }
      }
    }
    fetchTestSol();
  }, [connected, wallet, endpoint]);

  // For leaderboard, persist expensive "retrieve all game data" via useState()
  useEffect(() => {
    (async function getLeaderboardData() {
      if (wallet) {
        setLeaders(await anchorCLient.getLeaderboard({ wallet, endpoint }));
      }
    })();
  }, [wallet, endpoint]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1">
      <LanguageSwitcher currentLanguage={language} />

      <div className="navbar mb-2 bg-base-300 text-base-content rounded-box sm:p-4">
        <div className="flex-1 text-xl font-mono">
          {isClientSide && t("applicationTitle")}
        </div>
        <div>
          <WalletMultiButton />
        </div>
        <div className="badge badge-accent badge-outline flex-none ml-2">
          <a href="#devnet">devnet</a>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="p-4 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center p-2">
              {isGameReady && gameError && (
                <div className="alert alert-error shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{gameError}</span>
                  </div>
                </div>
              )}
              {isGameReady && (
                <div
                  onAnimationEnd={() => {
                    setEffect(false);
                  }}
                  className={`${effect && "animate-wiggle"}`}
                >
                  {clicks} clicks
                </div>
              )}
            </div>
            <button
              disabled={!isGameReady}
              onClick={() => {
                handleClick();
              }}
              className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full"
            >
              Click Me
            </button>

            {isGameReady && (
              <div>
                View game{" "}
                <a
                  className="underline"
                  href={solanaExplorerLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  details
                </a>{" "}
                on Solana.
              </div>
            )}

            {!isConnected && (
              <p className="p-2 text-center">
                To play game, please click{" "}
                <span className="font-bold">Select Wallet</span> above to choose
                your Solana wallet.
              </p>
            )}

            <p>
              See{" "}
              <a className="underline" href="#faqs">
                FAQs
              </a>{" "}
              below for more information.
            </p>

            {!isGameReady && isConnected && (
              <div>
                <p className="p-2">Game initializing...</p>
              </div>
            )}
          </div>

          {wallet && (
            <Leaderboard
              leaders={leaders}
              walletPublicKeyString={wallet.publicKey.toBase58()}
              clicks={clicks}
            />
          )}
        </div>
      </div>
    </div>
  );
};
