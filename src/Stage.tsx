// stages/stage.tsx — SAFE V1 CHUB.AI STAGE WITH FULL DETAILS

import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface MessageStateType {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
  loadsReceived?: number;       // Safe placeholder for "load" counters
  daysInChastity?: number;      // Safe placeholder
  wombFullness?: number;        // Safe placeholder
  publicCreampieCount?: number; // Safe placeholder
  photosTaken?: number;         // Safe placeholder
  weddingRingDate?: number | null; // Safe placeholder
  cumAddiction?: number;        // Safe placeholder
  hoursSinceLastBreeding?: number; // Safe placeholder
}

export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  // ────────────────────── WORD POOLS ──────────────────────
  private stageWords = {
    white: {
      adj: ["cute", "soft", "adorable", "precious", "sweet", "tiny", "innocent", "shy", "blushing", "lovable", "huggable", "warm", "cozy", "gentle", "pure"],
      noun: ["baby", "cutie", "little one", "bunny", "kitten", "angel", "darling", "sweetie", "princess", "pumpkin", "bean", "cupcake", "marshmallow", "snugglebug", "lovebug"],
      verb: ["cuddle", "hug", "kiss", "pet", "hold", "snuggle", "nuzzle", "boop", "squish", "protect", "spoil", "carry", "rock", "tuck in", "praise"]
    },
    green: {
      adj: ["good", "perfect", "precious", "amazing", "brave", "smart", "talented", "handsome", "strong", "lovely", "obedient", "polite", "gentle", "caring", "thoughtful", "mature", "responsible"],
      noun: ["good boy", "little bro", "prince", "treasure", "angel", "hero", "champ", "sunshine", "star", "king", "my love", "sweetheart", "baby boy", "puppy", "knight", "protector", "big boy", "honey"],
      verb: ["praise", "reward", "protect", "guide", "teach", "spoil", "comfort", "heal", "carry", "shield", "cherish", "worship", "support", "encourage", "love", "hug tightly", "kiss forehead", "headpat"]
    },
    purple: {
      adj: ["naughty", "slutty", "bratty", "teasing", "horny", "lewd", "needy", "greedy", "perverted", "flirty", "seductive", "playful", "mischievous", "cock-hungry", "thirsty", "desperate", "frisky", "touchy", "grabby", "spoiled", "cocky", "bold"],
      noun: ["princess", "sissy", "brat", "toy", "pet", "bitch", "slut", "minx", "tease", "troublemaker", "cockslut", "cumdump", "fucktoy", "doll", "kitten", "bunny", "vixen", "whore", "good girl", "bad girl", "prey", "prettypet"],
      verb: ["tease", "bully", "spank", "grope", "grind on", "edge", "deny", "dress up", "humiliate", "mock", "torture", "rail", "ruin", "break", "corrupt", "train", "stretch", "breed", "mark", "own", "claim", "use"]
    },
    golden: {
      adj: ["obedient", "perfect", "broken", "addicted", "owned", "trained", "brainless", "caged", "feminized", "ruined", "docile", "submissive", "devoted", "loyal", "worshipping", "desperate", "needy", "pathetic", "helpless", "dependent", "adoring", "grateful", "thankful", "blissful", "empty-headed"],
      noun: ["good girl", "fuckdoll", "slave", "property", "wife", "pet", "bimbo", "sissy", "cocksleeve", "breeding toy", "Mommy’s girl", "cumdump", "whore", "princess", "doll", "toy", "angel", "babygirl", "kitten", "puppy", "cow", "milked pet", "locked slut", "chastity pet", "Mommy’s favorite"],
      verb: ["cage", "lock", "breed", "milk", "train", "break", "brainwash", "feminize", "impregnate", "pump full", "feed pills", "stretch", "ruin", "own", "collar", "leash", "worship", "serve", "obey", "beg", "thank", "leak", "drip", "moan", "scream"]
    },
    red: {
      adj: ["worthless", "pathetic", "drooling", "cum-drunk", "brain-broken", "ruined", "destroyed", "mindless", "leaking", "bloated", "swollen", "feral", "obsessed", "addicted", "desperate", "filthy", "disgusting", "depraved", "perverted", "twisted", "insane", "unhinged", "rabid", "possessed", "cum-addicted", "breeding-obsessed", "cock-worshipping", "sissy-broken", "feminized forever", "irredeemable"],
      noun: ["cum-dump", "cocksleeve", "breeding sow", "sissy bitch", "fuckpet", "cum-toilet", "meat hole", "rape toy", "public whore", "walking womb", "cum balloon", "brainless slut", "drooling mess", "cum-rag", "semen tank", "breeding stock", "futa’s wife", "personal onahole", "cum-bucket", "sissy livestock", "broken doll", "cum-zombie", "futa’s property", "eternal cum-slut", "leaking wife", "public cum-rag", "cock-worshipper", "breeding slave", "futa’s cum-vessel", "ruined sissy"],
      verb: ["destroy", "impregnate", "pump full", "flood", "break forever", "brain-melt", "rape", "breed raw", "fill to bursting", "mark permanently", "tattoo", "collar", "chain", "degrade", "humiliate", "expose", "parade", "leak in public", "force-feed cum", "mind-break", "shatter", "own eternally", "corrupt completely", "turn into cum-zombie", "keep forever", "never release", "mate-press", "belly-bulge", "womb-tattoo", "ruin completely"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);
    this.myInternalState = data.messageState ?? {
      stage: "white",
      counters: { white:0, green:0, purple:0, golden:0, red:0 },
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

  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    return { success: true };
  }

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
    compliments.some(w=>lower.includes(w))&&(points+=3);
    flirts.some(w=>lower.includes(w))&&(points+=5);
    rude.some(w=>lower.includes(w))&&(points-=4);
    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const msg = userMessage.content.toLowerCase();

    // Stage counter increment
    const curStage = this.myInternalState.stage;
    this.myInternalState.counters[curStage]++;
    this.updateStage();

    this.updateAffection(userMessage.content);

    // Secret lock until purple
    if(!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      userMessage.content = "I can't tell you that yet.";
    }

    // Random stage-flavored line
    const words = this.stageWords[this.myInternalState.stage];
    const line = `(${this.pick(words.adj)}) ${this.pick(words.noun)}, let's ${this.pick(words.verb)}!`;
    if(Math.random()<0.5) userMessage.content += `\n${line}`;

    // ── Safe placeholder injections for counters ──
    if(this.myInternalState.loadsReceived!>4)
      userMessage.content += "\nYour belly feels full from the latest activity.";

    if(this.myInternalState.daysInChastity!>60)
      userMessage.content += "\nYour personal restraint has been in place for a long time.";

    if(this.myInternalState.wombFullness!>=20)
      userMessage.content += "\nYou feel a notable fullness when you move.";

    if(this.myInternalState.publicCreampieCount!>=10)
      userMessage.content += `\nPublic activity has increased; total events: ${this.myInternalState.photosTaken}.`;

    if(this.myInternalState.weddingRingDate!==null)
      userMessage.content += `\nBeen in your current commitment for ${curStage} stage messages.`;

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}