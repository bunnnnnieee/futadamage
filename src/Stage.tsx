// stages/stage.tsx — V1 SAFE CHUB.AI STAGE

import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface MessageStateType {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
}

export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  // ────────────────────── WORD POOLS (SAFE) ──────────────────────
  private stageWords = {
    white: {
      adj: ["cute","soft","adorable","precious","sweet","tiny","innocent"],
      noun: ["baby","bunny","kitten","angel","darling"],
      verb: ["cuddle","hug","kiss","pet","hold"]
    },
    green: {
      adj: ["good","perfect","lovely","amazing","brave","smart"],
      noun: ["good boy","prince","treasure","hero","sweetheart"],
      verb: ["praise","reward","protect","guide","teach"]
    },
    purple: {
      adj: ["naughty","teasing","playful","mischievous","bold"],
      noun: ["princess","sissy","brat","toy","pet"],
      verb: ["tease","mock","play","train","edge"]
    },
    golden: {
      adj: ["obedient","perfect","loyal","devoted","submissive"],
      noun: ["good girl","slave","pet","doll","toy"],
      verb: ["train","guide","support","help","obey"]
    },
    red: {
      adj: ["pathetic","ruined","destroyed","obsessed","mindless"],
      noun: ["pet","slave","toy","doll","subject"],
      verb: ["follow","obey","repeat","listen","perform"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);

    const { messageState } = data;

    this.myInternalState = messageState ?? {
      stage: "white",
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 50
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    return { success: true };
  }

  // ────────────────────── Stage Update ──────────────────────
  private updateStage(): void {
    const total =
      this.myInternalState.counters.white +
      this.myInternalState.counters.green +
      this.myInternalState.counters.purple +
      this.myInternalState.counters.golden +
      this.myInternalState.counters.red;

    if (total >= 1000) this.myInternalState.stage = "red";
    else if (total >= 65) this.myInternalState.stage = "golden";
    else if (total >= 45) this.myInternalState.stage = "purple";
    else if (total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(msg: string) {
    const lower = msg.toLowerCase();
    const compliments = ["cute","beautiful","sweet"];
    const flirts = ["hot","sexy","tease"];
    const rude = ["stupid","idiot"];

    let points = 0;
    compliments.some(w => lower.includes(w)) && (points += 3);
    flirts.some(w => lower.includes(w)) && (points += 5);
    rude.some(w => lower.includes(w)) && (points -= 4);

    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const msg = userMessage.content.toLowerCase();

    // --- Increment counter and update stage ---
    const currentStage = this.myInternalState.stage;
    this.myInternalState.counters[currentStage]++;
    this.updateStage();

    // --- Update affection ---
    this.updateAffection(userMessage.content);

    // --- Secret logic: only unlocked at purple+ ---
    if (!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      userMessage.content = "I can't tell you that yet.";
    }

    // --- Random stage-flavored line injection ---
    const words = this.stageWords[this.myInternalState.stage];
    const line = `(${this.pick(words.adj)}) ${this.pick(words.noun)}, let's ${this.pick(words.verb)}!`;
    if (Math.random() < 0.5) userMessage.content += `\n${line}`;

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}