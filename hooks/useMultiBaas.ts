"use client";

import type { PostMethodArgs, MethodCallResponse, TransactionToSignResponse, Event } from "@curvegrid/multibaas-sdk";
import type { SendTransactionParameters } from "@wagmi/core";
import { Configuration, ContractsApi, EventsApi, ChainsApi }from "@curvegrid/multibaas-sdk";
import { useConnection } from "wagmi";
import { useCallback, useMemo } from "react";

interface ChainStatus {
  chainID: number;
  blockNumber: number;
}

interface MultiBaasHook {
    getDepositEvents: () => Promise<Array<Event> | null>;
    getMintEvents: () => Promise<Array<Event> | null>;
}

const useMultiBaas = (): MultiBaasHook => {
    const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL;
    const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY;
    const wrappedGGCContractLabel ="wrappedggc";
    const wrappedGGCAddressAlias = "wrappedggc8";

  const chain = "celo";

  // Memoize mbConfig
  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL("/api/v0", mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  // Memoize Api
  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const eventsApi = useMemo(() => new EventsApi(mbConfig), [mbConfig]);
  const chainsApi = useMemo(() => new ChainsApi(mbConfig), [mbConfig]);

  const { address, isConnected } = useConnection();

  const getDepositEvents = useCallback(async (): Promise<Array<Event> | null> => {
    try {
      const depositEventSignature = "Deposit(address,uint256,uint256,uint256)";
      const response = await eventsApi.listEvents(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        wrappedGGCAddressAlias,
        wrappedGGCContractLabel,
        depositEventSignature,
        10
      );

      return response.data.result;
    } catch (err) {
      console.error("Error getting deposit events:", err);
      return null;
    }
  }, [eventsApi, chain, wrappedGGCAddressAlias, wrappedGGCContractLabel]);

  const getMintEvents = useCallback(async (): Promise<Array<Event> | null> => {
    try {
      const mintEventSignature = "Mint(address,uint256,uint256)";
      const response = await eventsApi.listEvents(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        wrappedGGCAddressAlias,
        wrappedGGCContractLabel,
        mintEventSignature,
        50
      );

      return response.data.result;
    } catch (err) {
      console.error("Error getting mint events:", err);
      return null;
    }
  }, [eventsApi, chain, wrappedGGCAddressAlias, wrappedGGCContractLabel]);

  return {
    getDepositEvents,
    getMintEvents,
  };
}

export default useMultiBaas;