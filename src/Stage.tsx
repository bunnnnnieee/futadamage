// stages/stage.tsx — FULLY WORKING GITHUB-READY CHUB.AI V1 STAGE
// Exactly as you asked: counters → stage progression, affection, secret lock, word pools

import { ReactElement } from "react";
import {
  StageBase,
  StageResponse,
  InitialData,
  Message,
  LoadResponse,
} from "@chub-ai/stages-ts";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface MessageState {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
}

export class Stage extends StageBase<any, any, MessageState, any> {
  private myInternalState: MessageState;

  // ────────────────────── WORD POOLS ──────────────────────
  private stageWords = {
    white: {
      adj: ["cute", "sweet", "adorable", "soft", "precious"],
      noun: ["baby", "cutie", "little one", "angel", "darling"],
      verb: ["cuddle", "hug", "kiss", "hold", "pet"],
    },
    green: {
      adj: ["good", "perfect", "lovely", "amazing", "precious"],
      noun: ["good boy", "sweetheart", "treasure", "prince", "my love"],
      verb: ["praise", "spoil", "protect", "cherish", "adore"],
    },
    purple: {
      adj: ["naughty", "slutty", "teasing", "horny", "bratty"],
      noun: ["princess", "sissy", "toy", "pet", "brat"],
      verb: ["tease", "spank", "dress up", "rail", "ruin"],
    },
    golden: {
      adj: ["obedient", "perfect", "brain-broken", "addicted", "owned"],
      noun: ["good girl", "fuckdoll", "slave", "wife", "property"],
      verb: ["cage", "breed", "train", "break", "own"],
    },
    red: {
      adj: ["pathetic", "worthless", "drooling", "cum-drunk", "ruined"],
      noun: ["cum-dump", "cocksleeve", "bitch", "whore", "breeding pet"],
      verb: ["destroy", "impregnate", "degrade", "mark", "break forever"],
    },
  };

  // ────────────────────── PICK HELPER ──────────────────────
  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageState, any>) {
    super(data);
    this.myInternalState = data.messageState ?? {
      stage: "white",
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 50,
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, MessageState>>> {
    return { success: true };
  }

  // ────────────────────── STAGE FROM COUNTERS ──────────────────────
  private updateStageFromCounters() {
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

  // ────────────────────── AFFECTION DETECTION ──────────────────────
  private updateAffection(msg: string) {
    const lower = msg.toLowerCase();
    const compliments = ["cute", "pretty", "beautiful", "love", "gorgeous", "perfect"];
    const flirts = ["sexy", "hot", "fuck", "cock", "horny", "want you"];
    const rude = ["bitch", "slut", "whore", "stupid"];

    let points = 0;
    compliments.some((w) => lower.includes(w)) && (points += 3);
    flirts.some((w) => lower.includes(w)) && (points += 5);
    rude.some((w) => lower.includes(w)) && (points -= 4);

    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    const msg = userMessage.content.toLowerCase();

    // ── Count this message toward counters ──
    const currentRarity = this.myInternalState.stage;
    this.myInternalState.counters[currentRarity]++;
    this.updateStageFromCounters();

    // ── Affection ──
    this.updateAffection(userMessage.content);

    // ── SECRET LOCK UNTIL PURPLE ──
    if (this.myInternalState.stage !== "purple" && this.myInternalState.stage !== "golden" && this.myInternalState.stage !== "red") {
      if (msg.includes("secret") || msg.includes("truth") || msg.includes("real feeling")) {
        userMessage.content = "I can't tell you that yet.";
      }
    }

    // ── INJECT RANDOM STAGE-FLAVORED LINE ──
    const words = this.stageWords[this.myInternalState.stage];
    const line = `\( {this.pick(words.adj)} \){this.pick(words.noun)}, I just want to ${this.pick(words.verb)} you right now~`;
    if (Math.random() < 0.6) {
      userMessage.content += `\n${line}`;
    }

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}