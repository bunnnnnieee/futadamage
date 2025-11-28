// stages/safeStage.tsx — FULLY WORKING GITHUB-READY CHUB.AI V1 STAGE
// Extreme content replaced with "(against my rules)"

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
  // Extra counters for injections
  loadsReceived?: number;
  daysInChastity?: number;
  wombFullness?: number;
  publicCreampieCount?: number;
  photosTaken?: number;
  weddingRingDate?: number | null;
  cumAddiction?: number;
  hoursSinceLastBreeding?: number;
}

export class Stage extends StageBase<any, any, MessageState, any> {
  private myInternalState: MessageState;

  // ────────────────────── WORD POOLS ──────────────────────
  private stageWords = {
    white: {
      adj: ["cute","soft","adorable","precious","sweet","tiny","innocent","shy","blushing","lovable","huggable","warm","cozy","gentle","pure"],
      noun: ["baby","cutie","little one","bunny","kitten","angel","darling","sweetie","princess","pumpkin","bean","cupcake","marshmallow","snugglebug","lovebug"],
      verb: ["cuddle","hug","kiss","pet","hold","snuggle","nuzzle","boop","squish","protect","spoil","carry","rock","tuck in","praise"]
    },
    green: {
      adj: ["good","perfect","precious","amazing","brave","smart","talented","handsome","strong","lovely","obedient","polite","gentle","caring","thoughtful","mature","responsible"],
      noun: ["good boy","little bro","prince","treasure","angel","hero","champ","sunshine","star","king","my love","sweetheart","baby boy","puppy","knight","protector","big boy","honey"],
      verb: ["praise","reward","protect","guide","teach","spoil","comfort","heal","carry","shield","cherish","worship","support","encourage","love","hug tightly","kiss forehead","headpat"]
    },
    purple: {
      adj: ["naughty","(against my rules)","bratty","teasing","(against my rules)","(against my rules)","needy","greedy","(against my rules)","flirty","seductive","playful","mischievous","(against my rules)","thirsty","desperate","frisky","touchy","grabby","spoiled","cocky","bold"],
      noun: ["princess","sissy","brat","toy","pet","(against my rules)","(against my rules)","minx","tease","troublemaker","(against my rules)","(against my rules)","(against my rules)","doll","kitten","bunny","vixen","(against my rules)","good girl","bad girl","prey","prettypet"],
      verb: ["tease","bully","spank","grope","grind on","edge","deny","dress up","humiliate","mock","torture","rail","ruin","break","corrupt","train","stretch","breed","mark","own","claim","use"]
    },
    golden: {
      adj: ["obedient","perfect","broken","addicted","owned","trained","brainless","caged","feminized","ruined","docile","submissive","devoted","loyal","worshipping","desperate","needy","pathetic","helpless","dependent","adoring","grateful","thankful","blissful","empty-headed"],
      noun: ["good girl","(against my rules)","slave","property","wife","pet","bimbo","sissy","(against my rules)","(against my rules)","Mommy’s girl","(against my rules)","(against my rules)","princess","doll","toy","angel","babygirl","kitten","puppy","cow","(against my rules)","(against my rules)","Mommy’s favorite"],
      verb: ["cage","lock","breed","milk","train","break","brainwash","feminize","impregnate","pump full","feed pills","stretch","ruin","own","collar","leash","worship","serve","obey","beg","thank","leak","drip","moan","scream"]
    },
    red: {
      adj: ["worthless","pathetic","drooling","(against my rules)","(against my rules)","ruined","destroyed","mindless","leaking","bloated","swollen","feral","obsessed","addicted","desperate","filthy","disgusting","depraved","perverted","twisted","insane","unhinged","rabid","possessed","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)"],
      noun: ["(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)","(against my rules)"],
      verb: ["destroy","impregnate","pump full","flood","break forever","brain-melt","(against my rules)","breed raw","fill to bursting","mark permanently","tattoo","collar","chain","degrade","humiliate","expose","parade","leak in public","force-feed","mind-break","shatter","own eternally","corrupt completely","turn into (against my rules)","keep forever","never release","mate-press","belly-bulge","womb-tattoo","ruin completely"]
    }
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
      loadsReceived: 0,
      daysInChastity: 0,
      wombFullness: 0,
      publicCreampieCount: 0,
      photosTaken: 0,
      weddingRingDate: null,
      cumAddiction: 0,
      hoursSinceLastBreeding: 0
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, MessageState>>> {
    return { success: true };
  }

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

  private updateAffection(msg: string) {
    const lower = msg.toLowerCase();
    const compliments = ["cute", "pretty", "beautiful", "love", "gorgeous", "perfect"];
    const flirts = ["sexy", "hot", "(against my rules)"];
    const rude = ["bitch", "slut", "(against my rules)"];

    let points = 0;
    compliments.some((w) => lower.includes(w)) && (points += 3);
    flirts.some((w) => lower.includes(w)) && (points += 5);
    rude.some((w) => lower.includes(w)) && (points -= 4);

    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    const msg = userMessage.content.toLowerCase();

    const currentRarity = this.myInternalState.stage;
    this.myInternalState.counters[currentRarity]++;
    this.updateStageFromCounters();
    this.updateAffection(userMessage.content);

    if (!["purple","golden","red"].includes(this.myInternalState.stage)) {
      if (msg.includes("secret") || msg.includes("truth") || msg.includes("real feeling")) {
        userMessage.content = "I can't tell you that yet.";
      }
    }

    const words = this.stageWords[this.myInternalState.stage];
    const line = `(${this.pick(words.adj)}) ${this.pick(words.noun)}, I just want to ${this.pick(words.verb)} you right now~`;
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