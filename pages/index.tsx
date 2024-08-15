import { Dashboard } from "@/components/dashboard";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { nanoid } from 'nanoid';
import Head from "next/head";
import { useEffect } from "react";
import { useLocalStorage } from 'usehooks-ts';
import { proxy, useSnapshot } from "valtio";

const state = proxy({
  init: false,
  userId: "",
})

export default function Home() {

  const { init, userId } = useSnapshot(state)
  const [value, setValue, removeValue] = useLocalStorage('USER_ID', "")

  useEffect(() => {
    if (value !== "") {
      state.userId = value
    } else {
      state.userId = nanoid()
      setValue(state.userId)
    }
    // console.log(state.userId)
    state.init = true
  }, [])

  return (
    <TooltipProvider>
      <Head>
        <title>AIGC 知识助手</title>
        <meta name="description" content="AI chat bot for tezign creative SKU" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {
        init && <Dashboard userId={userId} />
      }
      <Toaster />
    </TooltipProvider>
  );
}
